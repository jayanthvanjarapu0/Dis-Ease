import jsPDF from "jspdf";
import type { Profile } from "@/contexts/AuthContext";

interface ReportData {
  profile: Profile | null;
  symptoms: string;
  predictedDisease: string;
  severity: string;
  precautions: string[];
  medications: string[];
  disclaimer: string;
}

const hslVarToRgb = (varName: string): [number, number, number] => {
  if (typeof window === "undefined") return [0, 0, 0];
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const m = raw.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!m) return [0, 0, 0];
  const h = parseFloat(m[1]);
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return [Math.round((r + mm) * 255), Math.round((g + mm) * 255), Math.round((b + mm) * 255)];
};

export const generateMedicalReport = (data: ReportData) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = 0;

  const accent = hslVarToRgb("--accent");
  const fg = hslVarToRgb("--foreground");
  const muted: [number, number, number] = [110, 116, 130];

  // Header band
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Dis-Ease Health Report", margin, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("AI-supported preliminary symptom assessment", margin, 68);

  y = 120;
  doc.setTextColor(fg[0], fg[1], fg[2]);

  // Patient block
  const profile = data.profile;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Patient Information", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const patientLines = [
    `Name: ${profile?.name || "—"}`,
    `Age: ${profile?.age ?? "—"}`,
    `Gender: ${profile?.gender || "—"}`,
    `Blood group: ${profile?.blood_group || "—"}`,
    `Report date: ${new Date().toLocaleString()}`,
  ];
  patientLines.forEach((line) => { doc.text(line, margin, y); y += 15; });

  y += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // Symptoms
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Reported Symptoms", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const symLines = doc.splitTextToSize(data.symptoms, pageWidth - margin * 2);
  doc.text(symLines, margin, y);
  y += symLines.length * 14 + 10;

  // Prediction box
  doc.setFillColor(245, 248, 250);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 70, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(fg[0], fg[1], fg[2]);
  doc.text("Predicted condition", margin + 14, y + 22);
  doc.text("Severity", margin + 14, y + 48);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.text(data.predictedDisease, margin + 150, y + 22);
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.setFont("helvetica", "bold");
  doc.text(data.severity, margin + 150, y + 48);
  doc.setTextColor(fg[0], fg[1], fg[2]);
  y += 90;

  const renderList = (title: string, items: string[]) => {
    if (y > pageHeight - 140) { doc.addPage(); y = margin; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2);
      if (y + lines.length * 13 > pageHeight - 80) { doc.addPage(); y = margin; }
      doc.text(lines, margin, y);
      y += lines.length * 13 + 4;
    });
    y += 8;
  };

  renderList("Medications", data.medications);
  renderList("Precautions", data.precautions);

  // Disclaimer at bottom of last page
  if (y > pageHeight - 100) { doc.addPage(); y = margin; }
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, pageHeight - 70, pageWidth - margin, pageHeight - 70);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(muted[0], muted[1], muted[2]);
  const discLines = doc.splitTextToSize(data.disclaimer, pageWidth - margin * 2);
  doc.text(discLines, margin, pageHeight - 55);

  const filename = `dis-ease-report-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};