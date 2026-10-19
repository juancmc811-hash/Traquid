const { chromium } = require("C:/Users/carlos.moreno/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("http://127.0.0.1:8083/");
    await page.getByText("Gastos", { exact: true }).click();
    const todos = page.getByText("Todos", { exact: true });
    await todos.evaluate(n => {
      let candidate = n.parentElement;
      while (candidate && candidate.scrollWidth <= candidate.clientWidth) candidate = candidate.parentElement;
      if (!candidate) throw new Error("Scrollable category strip not found");
      candidate.setAttribute("data-drag-check", "strip");
    });
    const strip = page.locator('[data-drag-check="strip"]');
    const box = await strip.boundingBox();
    assert(box);
    const initial = await strip.evaluate(n => n.scrollLeft);
    await page.mouse.move(box.x + box.width - 20, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 20, box.y + box.height / 2, { steps: 16 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    const moved = await strip.evaluate(n => n.scrollLeft);
    assert(moved > initial + 100, "Mouse drag reveals more categories");
    assert.equal(await todos.locator("..").evaluate(n => n.style.backgroundColor), "rgb(36, 92, 67)", "Dragging does not select a category");
    await page.getByText("Otros", { exact: true }).click();
    assert.equal(await page.getByText("Otros", { exact: true }).locator("..").evaluate(n => n.style.backgroundColor), "rgb(36, 92, 67)", "Click still selects a category");
    await page.screenshot({ path: "tmp/drag-filters.png" });
    console.log("PASS: drag, no accidental selection, category click");
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
