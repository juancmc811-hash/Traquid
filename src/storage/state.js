import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "traquid.v1";
export const freshState = () => ({
  version: 1,
  mode: "week",
  budgets: {},
  expenses: [],
  name: "",
  goal: 0,
});
export async function loadState() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return freshState();
  const s = JSON.parse(raw);
  if (
    s.version !== 1 ||
    !["week", "month"].includes(s.mode) ||
    !s.budgets ||
    !Array.isArray(s.expenses) ||
    s.expenses.some(
      (e) =>
        !Number.isSafeInteger(e.cents) ||
        e.cents <= 0 ||
        typeof e.date !== "string",
    )
  )
    throw new Error("Datos locales no válidos");
  return { ...freshState(), ...s };
}
export const saveState = (state) =>
  AsyncStorage.setItem(KEY, JSON.stringify(state));
