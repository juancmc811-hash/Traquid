import { Platform, useWindowDimensions } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { catFor, categories } from "../config/categories";
import {
  dateKey,
  fromKey,
  money,
  parseAmount,
  periodBounds,
  summary,
} from "../utils/finance.mjs";
import { freshState, loadState, saveState } from "../storage/state";
import { niceDate } from "../utils/formatters";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useTraquidController() {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, 480);
  const [visibleExpenses, setVisibleExpenses] = useState(30);
  const [state, setState] = useState(freshState),
    [ready, setReady] = useState(false),
    [page, setPage] = useState("home"),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [storageError, setStorageError] = useState("");
  const [selected, setSelected] = useState(dateKey()),
    [month, setMonth] = useState(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12),
    ),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const [amount, setAmount] = useState(""),
    [note, setNote] = useState(""),
    [expenseDate, setExpenseDate] = useState(dateKey()),
    [category, setCategory] = useState("food"),
    [editId, setEditId] = useState(null),
    [formError, setFormError] = useState(""),
    [budgetMode, setBudgetMode] = useState("week"),
    [busy, setBusy] = useState(false);
  const queue = useRef(Promise.resolve());
  const timer = useRef();
  const scroll = useRef();
  useEffect(() => {
    loadState()
      .then(setState)
      .catch(() =>
        setStorageError(
          "No se pudieron leer los datos guardados. Recarga antes de continuar.",
        ),
      )
      .finally(() => setReady(true));
    return () => clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    if (!ready || storageError) return;
    queue.current = queue.current
      .catch(() => {})
      .then(() => saveState(state))
      .catch(() => {
        setStorageError(
          "No se han podido guardar los cambios. Comprueba el espacio disponible y recarga.",
        );
      });
  }, [state, ready]);
  const notify = useCallback(
    (message) => {
      setToast(message);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(""), 3500);
    },
    [setToast, timer],
  );
  const today = dateKey();
  const r = useMemo(
    () => summary(state),
    [state.mode, state.budgets, state.expenses, today],
  );
  const selectedRows = useMemo(
    () =>
      state.expenses
        .filter((e) => e.date === selected)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.expenses, selected],
  );
  const activeRows = useMemo(
    () =>
      r.expenses
        .filter(
          (e) =>
            (filter === "all" || e.category === filter) &&
            `${e.note} ${catFor(e.category).name}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            b.createdAt.localeCompare(a.createdAt),
        ),
    [r.expenses, filter, query],
  );
  const changePage = useCallback(
    (p) => {
      setVisibleExpenses(30);
      setPage(p);
      setQuery("");
      setFilter("all");
      scroll.current?.scrollTo({ y: 0, animated: false });
    },
    [scroll, setFilter, setPage, setQuery, setVisibleExpenses],
  );
  const openBudget = useCallback(() => {
    setBudgetMode(state.mode);
    setAmount(r.budget ? String(r.budget / 100).replace(".", ",") : "");
    setFormError("");
    setModal("budget");
  }, [r, setAmount, setBudgetMode, setFormError, setModal, state]);
  const openExpense = useCallback(
    (e = null) => {
      setEditId(e?.id || null);
      setAmount(e ? String(e.cents / 100).replace(".", ",") : "");
      setNote(e?.note || "");
      setCategory(e?.category || "food");
      setExpenseDate(e?.date || (page === "calendar" ? selected : today));
      setFormError("");
      setModal("expense");
    },
    [page, selected, today],
  );
  const commit = useCallback(() => {
    const cents = parseAmount(amount);
    if (!cents) {
      setFormError(
        "Introduce un importe mayor que cero, con un máximo de dos decimales.",
      );
      return;
    }
    if (modal === "budget") {
      const bounds = periodBounds(budgetMode);
      setState((s) => ({
        ...s,
        mode: budgetMode,
        budgets: { ...s.budgets, [`${budgetMode}:${bounds.start}`]: cents },
      }));
      setModal(null);
      notify("Presupuesto actualizado");
      return;
    }
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(expenseDate) ||
      Number.isNaN(fromKey(expenseDate).getTime()) ||
      dateKey(fromKey(expenseDate)) !== expenseDate ||
      expenseDate > today
    ) {
      setFormError("Usa una fecha válida (DD/MM/AAAA), hasta hoy.");
      return;
    }
    const e = {
      id: editId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      cents,
      note: note.trim().slice(0, 120),
      date: expenseDate,
      category,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      expenses: editId
        ? s.expenses.map((x) =>
            x.id === editId ? { ...e, createdAt: x.createdAt } : x,
          )
        : [...s.expenses, e],
    }));
    setSelected(expenseDate);
    setModal(null);
    notify(editId ? "Gasto actualizado" : "Gasto guardado");
  }, [
    amount,
    budgetMode,
    category,
    editId,
    expenseDate,
    modal,
    note,
    notify,
    setFormError,
    setModal,
    setSelected,
    setState,
    today,
  ]);
  const loadDemo = useCallback(() => {
    const p = periodBounds(state.mode);
    const t = new Date();
    const entries = [
      ["market", 3245, "Compra de la semana", 0],
      ["food", 490, "Café y tostada", 0],
      ["transport", 250, "Metro", 0],
      ["food", 1280, "Comida con amigos", 1],
      ["fun", 900, "Cine", 2],
      ["market", 1840, "Fruta y verduras", 3],
    ];
    const demo = entries.map(([category, cents, note, ago], i) => {
      const d = new Date(t);
      d.setDate(d.getDate() - ago);
      return {
        id: `demo-${Date.now()}-${i}`,
        category,
        cents,
        note,
        date: dateKey(d),
        createdAt: new Date().toISOString(),
      };
    });
    setState((s) => ({
      ...s,
      budgets: {
        ...s.budgets,
        [`${s.mode}:${p.start}`]: s.mode === "week" ? 18000 : 75000,
      },
      expenses: demo,
    }));
    setModal(null);
    notify("Ejemplo cargado. Puedes editarlo o borrar los datos en Ajustes.");
  }, [notify, setModal, setState, state]);
  const esc = useCallback(
    (s) =>
      String(s).replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      ),
    [],
  );
  const exportPDF = useCallback(async () => {
    setBusy(true);
    try {
      const rows = [...state.expenses].sort((a, b) =>
        b.date.localeCompare(a.date),
      );
      const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:18mm}body{font-family:Arial;color:#24382e;font-size:11px}h1{font-size:32px;color:#245c43;margin-bottom:8px}p{line-height:1.6}table{width:100%;border-collapse:collapse;margin-top:26px}th{text-align:left;background:#eef3e9}td,th{padding:12px 8px;border-bottom:1px solid #e7ebe1}tr{break-inside:avoid}thead{display:table-header-group}.amount{text-align:right}.footer{margin-top:24px;color:#66776a}</style></head><body><h1>traquid.</h1><p>Informe personal de gastos · ${esc(niceDate(today))}<br>Periodo actual: ${esc(niceDate(r.start))} - ${esc(niceDate(r.end))}<br>Presupuesto: ${esc(money(r.budget))} · Gastado: ${esc(money(r.spent))} · Restante: ${esc(money(r.remaining))}</p><h2>Todos los movimientos (${rows.length})</h2><table><thead><tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th class="amount">Importe</th></tr></thead><tbody>${rows.map((e) => `<tr><td>${esc(niceDate(e.date))}</td><td>${esc(catFor(e.category).label || catFor(e.category).name)}</td><td>${esc(e.note || "-")}</td><td class="amount">${esc(money(e.cents))}</td></tr>`).join("") || '<tr><td colspan="4">No hay gastos registrados.</td></tr>'}</tbody></table><p class="footer">Total histórico: ${esc(money(rows.reduce((s, e) => s + e.cents, 0)))}<br>Los importes reflejan los datos registrados por el usuario.</p></body></html>`;
      if (Platform.OS === "web") {
        const { downloadReport } = await import("../utils/report");
        await downloadReport(state, r, categories);
        notify("Informe PDF descargado");
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync())
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            UTI: ".pdf",
          });
        else await Print.printAsync({ uri });
      }
    } catch (e) {
      notify(e.message || "No se pudo exportar el PDF.");
    } finally {
      setBusy(false);
    }
  }, [esc, notify, r, setBusy, state, today]);
  const exportBackup = useCallback(async () => {
    if (Platform.OS !== "web") {
      notify(
        "La copia JSON está disponible en la versión web. Puedes exportar PDF en el móvil.",
      );
      return;
    }
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = `traquid-${today}.json`;
    a.click();
    URL.revokeObjectURL(u);
    notify("Copia de seguridad descargada");
  }, [notify, state, today]);

  return {
    activeRows,
    amount,
    budgetMode,
    busy,
    category,
    changePage,
    commit,
    editId,
    expenseDate,
    exportBackup,
    exportPDF,
    filter,
    formError,
    loadDemo,
    modal,
    month,
    note,
    notify,
    openBudget,
    openExpense,
    page,
    query,
    r,
    ready,
    scroll,
    selected,
    selectedRows,
    setAmount,
    setBudgetMode,
    setCategory,
    setExpenseDate,
    setFilter,
    setModal,
    setMonth,
    setNote,
    setQuery,
    setSelected,
    setState,
    setVisibleExpenses,
    state,
    storageError,
    toast,
    today,
    visibleExpenses,
    width,
  };
}
