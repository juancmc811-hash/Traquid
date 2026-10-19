import { money, fromKey, dateKey } from "./finance.mjs";
export async function downloadReport(state, summary, categories) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF();
  const green = [36, 92, 67],
    muted = [115, 133, 119];
  const rows = [...state.expenses].sort((a, b) => b.date.localeCompare(a.date));
  const header = () => {
    pdf.setTextColor(...green);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(26);
    pdf.text("traquid.", 18, 25);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...muted);
    pdf.text("Tu dinero, con calma. Informe personal de gastos.", 18, 34);
  };
  header();
  pdf.setTextColor(36, 56, 46);
  pdf.setFontSize(11);
  const nice = (k) =>
    fromKey(k).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  pdf.text(`Generado el ${nice(dateKey())}`, 18, 48);
  pdf.text(
    `Periodo actual: ${nice(summary.start)} - ${nice(summary.end)}`,
    18,
    56,
  );
  pdf.text(
    `Presupuesto: ${money(summary.budget)}   Gastado: ${money(summary.spent)}   Restante: ${money(summary.remaining)}`,
    18,
    65,
  );
  let y = 84;
  const tableHeader = () => {
    pdf.setFillColor(238, 243, 233);
    pdf.rect(18, y - 7, 174, 11, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...green);
    pdf.text("FECHA", 21, y);
    pdf.text("CATEGORIA", 49, y);
    pdf.text("DESCRIPCION", 91, y);
    pdf.text("IMPORTE", 189, y, { align: "right" });
    pdf.setFont("helvetica", "normal");
    y += 13;
  };
  tableHeader();
  for (const e of rows) {
    const category = categories.find((c) => c.id === e.category);
    const note = pdf.splitTextToSize(e.note || "-", 69);
    const h = Math.max(13, note.length * 4.5 + 7);
    if (y + h > 268) {
      pdf.addPage();
      header();
      y = 51;
      tableHeader();
    }
    pdf.setFontSize(9);
    pdf.setTextColor(36, 56, 46);
    pdf.text(fromKey(e.date).toLocaleDateString("es-ES"), 21, y);
    pdf.text(category?.label || category?.name || "Otros", 49, y);
    pdf.text(note, 91, y);
    pdf.text(money(e.cents), 189, y, { align: "right" });
    pdf.setDrawColor(231, 235, 225);
    pdf.line(18, y + h - 8, 192, y + h - 8);
    y += h;
  }
  if (!rows.length) {
    pdf.setTextColor(...muted);
    pdf.text("No hay gastos registrados.", 21, y);
    y += 16;
  }
  if (y + 20 > 270) {
    pdf.addPage();
    header();
    y = 52;
  }
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...green);
  pdf.setFontSize(11);
  pdf.text(
    `Total historico: ${money(rows.reduce((sum, e) => sum + e.cents, 0))}`,
    18,
    y + 10,
  );
  const count = pdf.getNumberOfPages();
  for (let i = 1; i <= count; i++) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...muted);
    pdf.text(
      "Los importes reflejan los datos registrados por el usuario.",
      18,
      284,
    );
    pdf.text(`${i} / ${count}`, 192, 284, { align: "right" });
  }
  pdf.save(`traquid-gastos-${dateKey()}.pdf`);
}
