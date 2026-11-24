import jsPDF from 'jspdf';
import type { AnalysisResult } from './scoring';
import { scoreLabel } from './scoring';
import type { RoadmapStep } from './roadmapData';
import { getRoadmapStep } from './roadmapData';

export function exportRoadmapPdf(
  analysis: AnalysisResult,
  practicedSkills: Record<string, boolean>,
  verifiedSkills: Record<string, boolean>
) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentW = W - margin * 2;

  // Colours
  const INK = [14, 15, 20] as const;
  const CREAM = [242, 240, 235] as const;
  const BRASS = [216, 155, 74] as const;
  const MUTED = [139, 138, 148] as const;

  let y = margin;

  function ensureSpace(needed: number) {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  }

  // Background
  doc.setFillColor(INK[0], INK[1], INK[2]);
  doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), 'F');

  // Title block
  doc.setFillColor(BRASS[0], BRASS[1], BRASS[2]);
  doc.rect(margin, y, 4, 36, 'F');

  doc.setTextColor(CREAM[0], CREAM[1], CREAM[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SkillMatch AI — Roadmap Report', margin + 14, y + 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(
    `${analysis.company.name} · ${analysis.company.role}`,
    margin + 14,
    y + 30
  );

  y += 56;

  // Score strip
  doc.setFillColor(30, 31, 39); // score strip
  doc.roundedRect(margin, y, contentW, 50, 6, 6, 'F');
  doc.setTextColor(BRASS[0], BRASS[1], BRASS[2]);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis.matchScore}%`, margin + 14, y + 32);
  doc.setTextColor(CREAM[0], CREAM[1], CREAM[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(scoreLabel(analysis.matchScore), margin + 60, y + 32);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.setFontSize(9);
  doc.text(
    `${analysis.matchedCount} of ${analysis.results.length} skills matched`,
    W - margin - 2,
    y + 32,
    { align: 'right' }
  );

  y += 66;

  // Section: Matched skills
  sectionHeader(doc, 'Matched Skills', margin, y, contentW, BRASS, INK);
  y += 26;

  const matched = analysis.results.filter((r) => r.matched);
  for (const r of matched) {
    ensureSpace(20);
    doc.setFillColor(30, 31, 39);
    doc.roundedRect(margin, y, contentW, 18, 3, 3, 'F');
    doc.setTextColor(CREAM[0], CREAM[1], CREAM[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`✓  ${r.skill.name}`, margin + 8, y + 12);
    if (verifiedSkills[r.skill.name]) {
      doc.setTextColor(52, 211, 153);
      doc.text('Verified', W - margin - 8, y + 12, { align: 'right' });
    }
    y += 22;
  }

  y += 12;

  // Section: Roadmap
  const missing = analysis.results.filter((r) => !r.matched);
  if (missing.length > 0) {
    ensureSpace(40);
    sectionHeader(doc, 'Your Roadmap', margin, y, contentW, BRASS, INK);
    y += 26;

    missing.forEach((r, idx) => {
      const step: RoadmapStep | null = getRoadmapStep(r.skill.name);
      const done = !!practicedSkills[r.skill.name];

      ensureSpace(72);

      // Step card
      if (done) doc.setFillColor(40, 36, 22); else doc.setFillColor(30, 31, 39);
      doc.roundedRect(margin, y, contentW, 64, 5, 5, 'F');
      if (done) {
        doc.setDrawColor(...BRASS);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, y, contentW, 64, 5, 5, 'S');
      }

      // Step number
      doc.setFillColor(BRASS[0], BRASS[1], BRASS[2]);
      doc.circle(margin + 20, y + 18, 8, 'F');
      doc.setTextColor(INK[0], INK[1], INK[2]);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}`, margin + 20, y + 21, { align: 'center' });

      // Title
      const titleR = done ? BRASS[0] : CREAM[0];
      const titleG = done ? BRASS[1] : CREAM[1];
      const titleB = done ? BRASS[2] : CREAM[2];
      doc.setTextColor(titleR, titleG, titleB);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(step?.title ?? r.skill.name, margin + 36, y + 20);

      // Time
      if (step) {
        doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(step.timeRange, margin + 36, y + 32);
      }

      // Subtasks (first 2)
      if (step) {
        doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
        doc.setFontSize(7.5);
        step.subtasks.slice(0, 2).forEach((task, ti) => {
          const lines = doc.splitTextToSize(`• ${task}`, contentW - 50);
          doc.text(lines[0], margin + 36, y + 44 + ti * 11);
        });
      }

      // Done stamp
      if (done) {
        doc.setTextColor(BRASS[0], BRASS[1], BRASS[2]);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('DONE', W - margin - 10, y + 20, { align: 'right' });
      }

      y += 72;
    });
  }

  y += 8;

  // Footer
  ensureSpace(30);
  doc.setFillColor(30, 31, 39);
  doc.rect(margin, y, contentW, 1, 'F');
  y += 10;
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Generated by SkillMatch AI · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    W / 2,
    y + 10,
    { align: 'center' }
  );

  doc.save(`${analysis.company.name.replace(/\s+/g, '_')}_Roadmap.pdf`);
}

function sectionHeader(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
  w: number,
  brass: readonly [number, number, number],
  ink: readonly [number, number, number]
) {
  doc.setFillColor(brass[0], brass[1], brass[2]);
  doc.rect(x, y, w, 20, 'F');
  doc.setTextColor(ink[0], ink[1], ink[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), x + 10, y + 13);
}
