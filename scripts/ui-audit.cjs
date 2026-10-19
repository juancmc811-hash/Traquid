const {
  chromium,
} = require("C:/Users/carlos.moreno/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const http = require("node:http");
const assert = require("node:assert/strict");

(async () => {
  const { dateKey, periodBounds } = await import(
    pathToFileURL(path.resolve("src/utils/finance.mjs"))
  );
  const today = dateKey();
  const week = periodBounds("week");
  const month = periodBounds("month");
  const fixture = {
    version: 1,
    name: "Carlos",
    mode: "week",
    goal: 0,
    budgets: {
      [`week:${week.start}`]: 24000,
      [`month:${month.start}`]: 120000,
    },
    expenses: [
      {
        id: "audit-1",
        category: "market",
        cents: 3875,
        note: "Compra semanal del supermercado",
        date: today,
        createdAt: new Date().toISOString(),
      },
      {
        id: "audit-2",
        category: "food",
        cents: 450,
        note: "Café y desayuno",
        date: today,
        createdAt: new Date(Date.now() - 1000).toISOString(),
      },
      {
        id: "audit-3",
        category: "transport",
        cents: 2000,
        note: "Abono de transporte",
        date: today,
        createdAt: new Date(Date.now() - 2000).toISOString(),
      },
    ],
  };
  const folder = process.env.AUDIT_OUTPUT || "tmp/ui-audit-before";
  fs.mkdirSync(folder, { recursive: true });
  let server;
  let previewUrl = process.env.TRAQUID_PREVIEW_URL || "http://localhost:8083";
  if (process.env.AUDIT_STATIC_ROOT) {
    const root = path.resolve(process.env.AUDIT_STATIC_ROOT);
    const types = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".ttf": "font/ttf",
      ".png": "image/png",
      ".css": "text/css",
    };
    server = http.createServer((request, response) => {
      const relative = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      const target = path.resolve(
        root,
        `.${relative === "/" ? "/index.html" : relative}`,
      );
      if (!target.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      fs.readFile(target, (error, bytes) => {
        if (error) {
          response.writeHead(404).end();
          return;
        }
        response.writeHead(200, {
          "Content-Type":
            types[path.extname(target)] || "application/octet-stream",
        });
        response.end(bytes);
      });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    previewUrl = `http://127.0.0.1:${server.address().port}`;
  }
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const report = [];
  try {
    for (const width of [320, 360, 390, 430]) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.addInitScript((state) => {
        if (!localStorage.getItem("traquid.v1"))
          localStorage.setItem("traquid.v1", JSON.stringify(state));
      }, fixture);
      await page.goto(previewUrl, { timeout: 120000 });
      await page
        .getByText("Hola, Carlos", { exact: true })
        .waitFor({ timeout: 120000 });
      await page
        .getByText("Abriendo Traquid", { exact: true })
        .waitFor({ state: "hidden", timeout: 3000 })
        .catch(() => {});
      // Wait for the launch overlay to leave, without assuming a device frame rate.
      await page
        .getByRole("button", { name: "Añadir gasto", exact: true })
        .last()
        .click({ trial: true });
      const snapshot = async (name) => {
        await page.waitForFunction(
          () =>
            [...document.querySelectorAll("div")]
              .filter(
                (el) =>
                  el.style.transform.includes("translateY") &&
                  el.style.opacity !== "",
              )
              .every((el) => Number(el.style.opacity) > 0.999),
          null,
          { timeout: 5000 },
        );
        await page.screenshot({
          path: `${folder}/${width}-${name}.png`,
          fullPage: true,
          animations: "disabled",
        });
        const metrics = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          buttons: [...document.querySelectorAll('[role="button"]')].map(
            (el) => {
              const r = el.getBoundingClientRect();
              return {
                label: el.getAttribute("aria-label") || el.textContent.trim(),
                x: r.x,
                y: r.y,
                width: r.width,
                height: r.height,
              };
            },
          ),
        }));
        report.push({ width, screen: name, errors: [...errors], ...metrics });
        if (process.env.AUDIT_VERIFY) {
          assert.equal(
            metrics.overflow,
            false,
            `${width}/${name}: page overflows`,
          );
          assert.deepEqual(errors, [], `${width}/${name}: runtime errors`);
          if (!name.includes("form")) {
            const buttons = [
              "Inicio",
              "Gastos",
              "Añadir gasto",
              "Calendario",
              "Ajustes",
            ].map((label) =>
              metrics.buttons.filter((button) => button.label === label).at(-1),
            );
            assert(
              buttons.every(
                (button) =>
                  button &&
                  button.height >= 48 &&
                  button.width >= 44 &&
                  button.x >= 0 &&
                  button.x + button.width <= width + 1,
              ),
              `${width}/${name}: navigation targets`,
            );
            assert(
              Math.max(...buttons.map((button) => button.y)) -
                Math.min(...buttons.map((button) => button.y)) <
                1,
              `${width}/${name}: navigation misaligned`,
            );
          } else {
            const save = metrics.buttons.find((button) =>
              button.label.includes("Guardar gasto"),
            );
            assert(
              save &&
                save.height >= 48 &&
                save.y >= 0 &&
                save.y + save.height <= 844,
              `${width}/${name}: save button clipped`,
            );
          }
        }
      };
      await snapshot("home");
      await page.getByText("Disponible al día", { exact: true }).click();
      await page.getByText("Conoce tus hábitos", { exact: true }).waitFor();
      await snapshot("stats");
      if (process.env.AUDIT_VERIFY) {
        await page.getByRole("button", { name: "Mes", exact: true }).click();
        await snapshot("stats-month");
        await page.getByRole("button", { name: "Semana", exact: true }).click();
      }
      await page.getByRole("button", { name: "Gastos", exact: true }).click();
      await page.getByText("Tus movimientos", { exact: true }).waitFor();
      await snapshot("expenses");
      await page
        .getByRole("button", { name: "Calendario", exact: true })
        .click();
      await page.getByText("Tu calendario", { exact: true }).waitFor();
      await snapshot("calendar");
      if (process.env.AUDIT_VERIFY) {
        const monthTitle = await page
          .getByRole("button", { name: "Mes anterior", exact: true })
          .locator("..")
          .innerText();
        await page
          .getByRole("button", { name: "Mes siguiente", exact: true })
          .click();
        const nextTitle = await page
          .getByRole("button", { name: "Mes anterior", exact: true })
          .locator("..")
          .innerText();
        assert.notEqual(monthTitle, nextTitle);
        await page
          .getByRole("button", { name: "Mes anterior", exact: true })
          .click();
      }
      await page.getByRole("button", { name: "Ajustes", exact: true }).click();
      await page.getByText("A tu manera", { exact: true }).waitFor();
      await snapshot("settings");
      if (process.env.AUDIT_VERIFY) {
        const profile = page.getByLabel("¿Cómo te llamas?", { exact: true });
        await profile.fill("Carlos");
        await profile.pressSequentially(" auditado");
        assert.equal(await profile.inputValue(), "Carlos auditado");
        assert(
          await profile.evaluate(
            (element) => element === document.activeElement,
          ),
          `${width}: profile loses focus`,
        );
      }
      await page
        .getByRole("button", { name: "Añadir gasto", exact: true })
        .last()
        .click();
      await page.getByLabel("Importe en euros", { exact: true }).waitFor();
      await snapshot("expense-form");
      await page.getByLabel("Fecha (DD/MM/AAAA)", { exact: true }).click();
      await snapshot("date-form");
      if (process.env.AUDIT_VERIFY) {
        const note = page.getByLabel("¿En qué lo has gastado?", {
          exact: true,
        });
        await page
          .getByLabel("Importe en euros", { exact: true })
          .fill("12,34");
        await note.fill("Prueba de auditoría");
        await note.pressSequentially(" continua");
        assert.equal(await note.inputValue(), "Prueba de auditoría continua");
        assert(
          await note.evaluate((element) => element === document.activeElement),
          `${width}: input loses focus`,
        );
        await page
          .getByLabel("Fecha (DD/MM/AAAA)", { exact: true })
          .fill("31/02/2026");
        await page
          .getByRole("button", { name: "Guardar gasto", exact: true })
          .click();
        await page
          .getByText("Usa una fecha válida (DD/MM/AAAA), hasta hoy.", {
            exact: true,
          })
          .waitFor();
        await page
          .getByLabel("Fecha (DD/MM/AAAA)", { exact: true })
          .fill(today.split("-").reverse().join("/"));
        await page
          .getByRole("button", { name: "Guardar gasto", exact: true })
          .click();
        await page
          .getByLabel("Importe en euros", { exact: true })
          .waitFor({ state: "hidden" });
        await page.getByRole("button", { name: "Gastos", exact: true }).click();
        await page
          .getByText("Prueba de auditoría continua", { exact: true })
          .waitFor();
        await page
          .getByLabel("Buscar un gasto", { exact: true })
          .fill("auditoría");
        assert.equal(
          await page.locator('[data-testid^="expense-row-"]').count(),
          1,
        );
        await page.waitForFunction(() =>
          localStorage
            .getItem("traquid.v1")
            .includes("Prueba de auditoría continua"),
        );
        await page.reload();
        await page.getByRole("button", { name: "Gastos", exact: true }).click();
        await page
          .getByText("Prueba de auditoría continua", { exact: true })
          .waitFor();
        console.log(
          `PASS ${width}: layout, focus, invalid date, save, search, persistence`,
        );
      }
      await context.close();
    }
    if (process.env.AUDIT_VERIFY) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      const largeFixture = {
        ...fixture,
        expenses: Array.from({ length: 600 }, (_, index) => ({
          ...fixture.expenses[0],
          id: `large-${index}`,
          cents: 100,
          note: `Movimiento ${index}`,
        })),
      };
      await page.addInitScript(
        (state) => localStorage.setItem("traquid.v1", JSON.stringify(state)),
        largeFixture,
      );
      await page.goto(previewUrl);
      await page.getByText("Hola, Carlos", { exact: true }).waitFor();
      await page.getByRole("button", { name: "Gastos", exact: true }).click();
      await page.locator('[data-testid^="expense-row-"]').first().waitFor();
      assert.equal(
        await page.locator('[data-testid^="expense-row-"]').count(),
        30,
      );
      await page
        .getByRole("button", { name: "Ver más movimientos", exact: true })
        .click();
      assert.equal(
        await page.locator('[data-testid^="expense-row-"]').count(),
        60,
      );
      await page
        .getByLabel("Buscar un gasto", { exact: true })
        .fill("Movimiento 599");
      assert.equal(
        await page.locator('[data-testid^="expense-row-"]').count(),
        1,
      );
      await page.screenshot({
        path: `${folder}/390-large-list-search.png`,
        fullPage: true,
      });
      console.log(
        "PASS 600 expenses: 30 initial rows, 60 after load, search reaches final row",
      );
      await context.close();
      const fresh = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      });
      const freshPage = await fresh.newPage();
      await freshPage.goto(previewUrl);
      await freshPage
        .getByRole("button", { name: "Empezar", exact: true })
        .click({ trial: true });
      await freshPage.screenshot({
        path: `${folder}/390-first-use.png`,
        fullPage: true,
      });
      await freshPage
        .getByRole("button", { name: "Empezar", exact: true })
        .click();
      await freshPage
        .getByLabel("Presupuesto en euros", { exact: true })
        .fill("180");
      await freshPage.screenshot({
        path: `${folder}/390-budget-form.png`,
        fullPage: true,
      });
      await freshPage
        .getByRole("button", { name: "Guardar presupuesto", exact: true })
        .click();
      await freshPage
        .getByRole("button", { name: "Empezar", exact: true })
        .waitFor({ state: "hidden" });
      console.log("PASS first use: budget creation and save");
      await fresh.close();
    }
    fs.writeFileSync(`${folder}/report.json`, JSON.stringify(report, null, 2));
    console.log(
      JSON.stringify(
        report.map(({ width, screen, overflow, errors }) => ({
          width,
          screen,
          overflow,
          errors,
        })),
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
