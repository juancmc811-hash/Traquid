const {
  chromium,
} = require("C:/Users/carlos.moreno/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto(process.env.TRAQUID_PREVIEW_URL || "http://localhost:8081");
  await page.getByText("Cada pequeño paso cuenta.", { exact: true }).waitFor();
  await page.getByText("Empezar", { exact: true }).click();
  await page.getByLabel("Presupuesto en euros", { exact: true }).fill("180");
  await page.getByText("Guardar presupuesto", { exact: true }).click();
  await page.getByText("Añadir gasto", { exact: true }).first().click();
  await page.getByLabel("Importe en euros", { exact: true }).fill("32,45");
  await page
    .getByLabel("¿En qué lo has gastado?", { exact: true })
    .fill("Compra de prueba");
  await page.getByText("Supermercado", { exact: true }).click();
  await page.getByText("Guardar gasto", { exact: true }).click();
  await page.getByText("Compra de prueba", { exact: true }).waitFor();
  assert((await page.locator("body").innerText()).includes("147,55"));
  await page.reload();
  await page.getByText("Compra de prueba", { exact: true }).waitFor();
  await page.getByText("Compra de prueba", { exact: true }).click();
  await page.getByLabel("Importe en euros", { exact: true }).fill("40");
  await page.getByText("Guardar cambios", { exact: true }).click();
  assert((await page.locator("body").innerText()).includes("140,00"));
  await page.getByText("Calendario", { exact: true }).first().click();
  await page.getByText("Tu calendario", { exact: true }).waitFor();
  await page.getByText("Compra de prueba", { exact: true }).waitFor();
  await page.getByText("Estadísticas", { exact: true }).click();
  await page.getByText("Conoce tus hábitos", { exact: true }).waitFor();
  await page.getByText("Ajustes", { exact: true }).first().click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByText('Exportar informe PDF',{exact:true}).click();
  const report=await downloadPromise;await report.saveAs('tmp/traquid-report.pdf');
  assert(fs.readFileSync('tmp/traquid-report.pdf').subarray(0,4).toString()==='%PDF');
  await page
    .getByLabel("¿Cómo te llamas?", { exact: true })
    .pressSequentially("Carlos");
  assert.equal(
    await page.getByLabel("¿Cómo te llamas?", { exact: true }).inputValue(),
    "Carlos",
  );
  await page.getByText("Inicio", { exact: true }).first().click();
  await page.getByText("Hola, Carlos", { exact: true }).waitFor();
  await page.screenshot({ path: "tmp/desktop-live.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "tmp/mobile.png", fullPage: true });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
  );
  await page.getByText("Gastos", { exact: true }).click();
  await page.getByText("Compra de prueba", { exact: true }).click();
  await page.getByText("Eliminar este gasto", { exact: true }).click();
  await page.getByText("Eliminar gasto", { exact: true }).click();
  await page.getByText("Aún no hay movimientos", { exact: true }).waitFor();
  await page.getByText("Ajustes", { exact: true }).click();
  await page.getByText("Cargar un ejemplo", { exact: true }).click();
  await page.getByText("Cargar datos de ejemplo", { exact: true }).click();
  await page.waitForTimeout(600);
  await page.getByText("Inicio", { exact: true }).click();
  await page.waitForTimeout(3600);
  await page.screenshot({ path: "tmp/mobile-example.png", fullPage: true });
  fs.writeFileSync(
    "tmp/browser-results.json",
    JSON.stringify(
      {
        errors,
        checks: [
          "create budget",
          "create expense",
          "persist reload",
          "edit expense",
          "calendar",
          "statistics",
          "profile typing",
          "mobile no overflow",
          "delete expense",
          "demo",
        ],
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ errors, checks: 10 }));
  assert.equal(errors.length, 0);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
