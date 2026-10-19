import { test } from "node:test";
import assert from "node:assert/strict";
import {
  periodBounds,
  summary,
  parseAmount,
  riskColor,
} from "../src/utils/finance.mjs";
test("weeks start Monday, including a Sunday and year boundary", () => {
  assert.deepEqual(periodBounds("week", new Date(2026, 9, 11)), {
    start: "2026-10-05",
    end: "2026-10-11",
    days: 7,
  });
  assert.equal(periodBounds("week", new Date(2027, 0, 1)).start, "2026-12-28");
});
test("month accounts for leap year", () =>
  assert.equal(periodBounds("month", new Date(2028, 1, 20)).days, 29));
test("money is parsed in integer cents and invalid input rejected", () => {
  assert.equal(parseAmount("12,45"), 1245);
  assert.equal(parseAmount("0.01"), 1);
  for (const v of ["-2", "1.001", "hello", "0", "", "Infinity"])
    assert.equal(parseAmount(v), null);
});
test("remaining daily allowance includes today, filters other periods and handles overspend", () => {
  const s = {
    mode: "week",
    budgets: { "week:2026-10-05": 14000 },
    expenses: [
      { date: "2026-10-05", cents: 2100 },
      { date: "2026-10-04", cents: 9000 },
    ],
  };
  const r = summary(s, new Date(2026, 9, 5));
  assert.equal(r.remaining, 11900);
  assert.equal(r.allowance, 1700);
  assert.equal(r.overspend, 100);
  s.expenses.push({ date: "2026-10-06", cents: 15000 });
  const debt = summary(s, new Date(2026, 9, 6));
  assert.equal(debt.remaining, -3100);
  assert.equal(debt.allowance, 0);
});
test("risk thresholds and no budget", () => {
  assert.equal(riskColor(49.99), "#367759");
  assert.equal(riskColor(50), "#B69B3C");
  assert.equal(riskColor(75), "#D38B38");
  assert.equal(riskColor(90), "#D6574B");
  assert.equal(summary({ mode: "week", budgets: {}, expenses: [] }).used, 0);
});
