// Local synthetic-data audit. Uses the same installed Playwright and Edge as ui-audit.cjs.
const {
  chromium,
} = require("C:/Users/carlos.moreno/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");

(async () => {
  const { dateKey, periodBounds } = await import(
    pathToFileURL(path.resolve("src/utils/finance.mjs"))
  );
  const today = dateKey(),
    week = periodBounds("week");
  const output = "tmp/home-states";
  fs.mkdirSync(output, { recursive: true });
  const root = path.resolve("dist");
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = path.resolve(
      root,
      "." + (pathname === "/" ? "/index.html" : pathname),
    );
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (error, bytes) => {
      if (error) return res.writeHead(404).end();
      res.setHeader(
        "Content-Type",
        {
          ".js": "application/javascript",
          ".html": "text/html",
          ".css": "text/css",
          ".png": "image/png",
          ".ttf": "font/ttf",
        }[path.extname(file)] || "application/octet-stream",
      );
      res.end(bytes);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
    const cases = [
      ["normal", 24000, [3875, 450, 2000], null],
      ["empty", 0, [], "Sin referencia"],
      ["no-expenses", 70000, [], "Dentro del ritmo"],
      ["exhausted", 70000, [70000], "Sin saldo disponible"],
      ["negative", 70000, [80000], "Sin saldo disponible"],
      ["large", 100000000, [10000000, 8000000, 1000000, 1000000], null],
      ["unbudgeted", 0, [1000], "Sin referencia"],
    ];
    for (const width of [320, 390, 768])
      for (const [name, budget, amounts, expected] of cases) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          reducedMotion: "reduce",
        });
        const state = {
          version: 1,
          mode: "week",
          name:
            name === "normal"
              ? "Carlos"
              : "Carlos con un nombre muy largo para comprobar el ajuste",
          goal: 0,
          budgets: { ["week:" + week.start]: budget },
          expenses: amounts.map((cents, i) => ({
            id: "case-" + i,
            cents,
            date: today,
            createdAt: new Date(Date.now() - i * 1000).toISOString(),
            category: "food",
            note: "Un concepto de gasto largo que debe ajustarse sin desplazar el importe fuera de pantalla",
          })),
        };
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.addInitScript(
          (s) => localStorage.setItem("traquid.v1", JSON.stringify(s)),
          state,
        );
        await page.goto("http://127.0.0.1:" + server.address().port);
        await page
          .getByText("Tu periodo, de un vistazo.", { exact: true })
          .waitFor();
        await page
          .getByText("Abriendo Traquid", { exact: true })
          .waitFor({ state: "hidden" });
        if (expected) await page.getByText(expected, { exact: true }).waitFor();
        assert.equal(
          await page.locator('[data-testid^="expense-row-"]').count(),
          Math.min(3, amounts.length),
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        // Check actual text bounds, not only document overflow (RN scroll containers can clip).
        const clipped = await page
          .locator('[dir="auto"]')
          .evaluateAll((elements) =>
            elements
              .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
              })
              .map((el) => el.textContent),
          );
        assert.deepEqual(clipped, [], name + "/" + width);
        const clippedAmounts = await page
          .locator('[dir="auto"]')
          .evaluateAll((elements) =>
            elements
              .filter(
                (el) =>
                  el.textContent.includes("€") &&
                  el.children.length === 0 &&
                  el.scrollWidth > el.clientWidth + 1,
              )
              .map((el) => el.textContent),
          );
        assert.deepEqual(
          clippedAmounts,
          [],
          "Truncated amounts: " + name + "/" + width,
        );
        if (budget === 0)
          assert.equal(
            await page.getByRole("progressbar").getAttribute("aria-valuenow"),
            null,
          );
        if (name === "negative")
          await page.getByText("-100,00 €", { exact: true }).waitFor();
        await page.screenshot({
          path: output + "/" + width + "-" + name + ".png",
          fullPage: true,
        });
        await page
          .getByText("Últimos gastos", { exact: true })
          .scrollIntoViewIfNeeded();
        await page.screenshot({
          path: output + "/" + width + "-" + name + "-recent.png",
          fullPage: true,
        });
        await page
          .getByRole("button", { name: "Añadir gasto", exact: true })
          .first()
          .click();
        await page.getByLabel("Importe en euros", { exact: true }).waitFor();
        assert.deepEqual(errors, []);
        console.log(
          "PASS " +
            width +
            "/" +
            name +
            ": state, recent limit, text bounds, add expense, reduced motion",
        );
        await context.close();
      }
  } finally {
    await browser?.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
