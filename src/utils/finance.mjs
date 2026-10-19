export const dateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const fromKey = (key) => new Date(`${key}T12:00:00`);
export function periodBounds(mode, date = new Date()) {
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
  );
  if (mode === "month") start.setDate(1);
  else start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  if (mode === "month") {
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
  } else end.setDate(end.getDate() + 6);
  return {
    start: dateKey(start),
    end: dateKey(end),
    days: Math.round((end - start) / 86400000) + 1,
  };
}
export const money = (cents) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
export function parseAmount(value) {
  const s = String(value).trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const [whole, fraction = ""] = s.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 100000000
    ? cents
    : null;
}
export function riskColor(used) {
  return used >= 90
    ? "#D6574B"
    : used >= 75
      ? "#D38B38"
      : used >= 50
        ? "#B69B3C"
        : "#367759";
}
// Presentation classification only; summary remains the source of all amounts.
export function financialPace(r) {
  if (r.budget <= 0) return { status: "unset", ratio: null };
  const expected = r.expectedSpent;
  const ratio = expected > 0 ? r.spent / expected : r.spent > 0 ? Infinity : 0;
  // Exhaustion must never receive a reassuring label, including the last day.
  const status =
    r.remaining <= 0 || r.overspend > 0
      ? "above"
      : ratio >= 0.9
        ? "near"
        : "within";
  return { status, ratio };
}
export function summary(state, date = new Date()) {
  const bounds = periodBounds(state.mode, date);
  const budget = state.budgets[`${state.mode}:${bounds.start}`] || 0;
  const expenses = state.expenses.filter(
    (e) => e.date >= bounds.start && e.date <= bounds.end,
  );
  const spent = expenses.reduce((s, e) => s + e.cents, 0);
  const today = dateKey(date);
  const daysLeft = Math.max(
    1,
    Math.round((fromKey(bounds.end) - fromKey(today)) / 86400000) + 1,
  );
  const todaySpent = expenses
    .filter((e) => e.date === today)
    .reduce((s, e) => s + e.cents, 0);
  const remaining = budget - spent;
  const allowance = budget ? Math.floor(Math.max(0, remaining) / daysLeft) : 0;
  const elapsed = bounds.days - daysLeft + 1;
  const expectedSpent = budget
    ? Math.floor((budget * elapsed) / bounds.days)
    : 0;
  const overspend = budget ? Math.max(0, spent - expectedSpent) : 0;
  return {
    ...bounds,
    budget,
    expenses,
    spent,
    remaining,
    daysLeft,
    todaySpent,
    allowance,
    overspend,
    expectedSpent,
    used: budget ? (spent / budget) * 100 : 0,
  };
}
