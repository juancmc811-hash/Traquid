import test from "node:test";
import assert from "node:assert/strict";
import { financialPace, summary } from "../src/utils/finance.mjs";

const date = new Date(2026, 9, 19, 12);
function result(spent, budget = 7000, day = date) {
  return summary(
    {
      mode: "week",
      budgets: { "week:2026-10-19": budget },
      expenses: spent ? [{ date: "2026-10-19", cents: spent }] : [],
    },
    day,
  );
}
test("pace boundaries use proportional spending including today", () => {
  for (const [spent, status] of [
    [0, "within"],
    [899, "within"],
    [900, "near"],
    [1000, "near"],
    [1001, "above"],
  ]) {
    assert.equal(financialPace(result(spent)).status, status, String(spent));
  }
});
test("no budget has no pace; exhaustion and negative balances are never reassuring", () => {
  assert.equal(financialPace(result(0, 0)).status, "unset");
  assert.equal(financialPace(result(500, 0)).status, "unset");
  for (const cents of [7000, 7001]) {
    assert.equal(
      financialPace(result(cents, 7000, new Date(2026, 9, 25, 12))).status,
      "above",
    );
  }
});
test("pace is distinct from balance and preserves summary amounts", () => {
  const r = result(1001);
  const before = structuredClone(r);
  assert.ok(r.remaining > 0);
  assert.equal(r.expectedSpent, 1000);
  assert.equal(r.overspend, 1);
  assert.equal(r.remaining, 5999);
  assert.equal(r.allowance, 857);
  assert.equal(financialPace(r).status, "above");
  assert.deepEqual(r, before);
});
test("monthly pace uses real elapsed days and handles rounding to zero", () => {
  const r = summary(
    {
      mode: "month",
      budgets: { "month:2026-10-01": 31000 },
      expenses: [{ date: "2026-10-19", cents: 17100 }],
    },
    date,
  );
  assert.equal(financialPace(r).status, "near");
  assert.equal(financialPace(result(0, 1)).status, "within");
  assert.equal(result(0, 1).expectedSpent, 0);
  assert.equal(financialPace(result(1, 1)).status, "above");
});
