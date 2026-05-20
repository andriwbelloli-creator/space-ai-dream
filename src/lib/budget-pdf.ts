import { jsPDF } from "jspdf";

export type BudgetItem = {
  tag: "Essencial" | "Recomendado" | "Opcional";
  name: string;
  cat: string;
  price: string;
};

export type BudgetData = {
  project: string;       // e.g. "Sala · Japandi"
  email?: string;
  whatsapp?: string;
  items: ReadonlyArray<BudgetItem>;
  estimate: string;      // e.g. "R$ 3.000 – 8.000"
};

const ACCENT: [number, number, number] = [196, 101, 74];   // terracotta
const INK:    [number, number, number] = [28, 26, 24];
const MUTED:  [number, number, number] = [120, 115, 110];
const SOFT:   [number, number, number] = [244, 240, 233];

export function generateBudgetPdf(data: BudgetData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;

  // ---------- Header bar ----------
  doc.setFillColor(...INK);
  doc.rect(0, 0, W, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Ideal Space", M, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(220, 215, 205);
  doc.text("Orçamento do seu projeto · gerado com IA", M, 64);
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const date = new Date().toLocaleDateString("pt-BR");
  doc.text(date.toUpperCase(), W - M, 44, { align: "right" });

  y = 130;

  // ---------- Project summary card ----------
  doc.setFillColor(...SOFT);
  doc.roundedRect(M, y, W - M * 2, 96, 12, 12, "F");
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("PROJETO", M + 18, y + 24);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.project, M + 18, y + 46);

  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("ESTIMATIVA TOTAL", W - M - 18, y + 24, { align: "right" });
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(data.estimate, W - M - 18, y + 50, { align: "right" });
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${data.items.length} itens sugeridos`, W - M - 18, y + 68, { align: "right" });

  y += 96 + 28;

  // ---------- Shopping list, grouped by tag ----------
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Lista de compras", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("Organizada por prioridade e categoria", M, y + 14);
  y += 32;

  const groups: Array<BudgetItem["tag"]> = ["Essencial", "Recomendado", "Opcional"];
  for (const tag of groups) {
    const itemsInGroup = data.items.filter((i) => i.tag === tag);
    if (!itemsInGroup.length) continue;

    if (y > H - 140) { doc.addPage(); y = M; }

    // Section header
    doc.setFillColor(...ACCENT);
    doc.rect(M, y, 3, 14, "F");
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(tag.toUpperCase(), M + 12, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.setFontSize(9);
    doc.text(`${itemsInGroup.length} ${itemsInGroup.length === 1 ? "item" : "itens"}`, W - M, y + 11, { align: "right" });
    y += 22;

    // Table header
    doc.setDrawColor(225, 220, 210);
    doc.line(M, y, W - M, y);
    y += 14;

    for (const it of itemsInGroup) {
      if (y > H - 80) { doc.addPage(); y = M; }

      doc.setTextColor(...INK);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(it.name, M, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...MUTED);
      doc.setFontSize(9);
      doc.text(it.cat, M, y + 13);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...INK);
      doc.setFontSize(10.5);
      doc.text(it.price, W - M, y, { align: "right" });

      y += 26;
      doc.setDrawColor(238, 234, 226);
      doc.line(M, y - 6, W - M, y - 6);
    }

    y += 16;
  }

  // ---------- Footer ----------
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(225, 220, 210);
    doc.line(M, H - 56, W - M, H - 56);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      "Valores estimados, podem variar conforme loja e disponibilidade. Alguns links podem gerar comissão para o Ideal Space.",
      M, H - 38, { maxWidth: W - M * 2 }
    );
    doc.text(`idealspace.com.br  ·  ${p} / ${pageCount}`, W - M, H - 22, { align: "right" });
  }

  const slug = data.project.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(`ideal-space-orcamento-${slug || "projeto"}.pdf`);
}