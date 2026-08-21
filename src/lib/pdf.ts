import { jsPDF } from "jspdf";

import { logoPDF } from "../../branding.json";
import type { AnswerEntry, AppState } from "./state";
import type { Form, Section } from "../types";

const writeControlStatus = (
    doc: jsPDF,
    text: string,
    x: number,
    y: number
): number => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const width = doc.getTextWidth(text) + 8;
    doc.roundedRect(x, y, width, 7, 1, 1, "FD");
    doc.text(text, x + 4, y + 4.8);

    return width;
};

const drawSection = (
    form: Form,
    answers: Record<string, AnswerEntry>,
    doc: jsPDF,
    section: Section,
    x: number,
    y: number,
    pageWidth: number
): number => {
    const boxWidth = pageWidth - x * 2;
    const pageHeight = doc.internal.pageSize.getHeight();

    // Try to prevent orphan headers
    if (y + 25 > pageHeight - 12) {
        doc.addPage();
        y = 15;
    }

    // Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#000");
    doc.text(section.name, x, y);
    y += 4;

    // Separator
    doc.setDrawColor("#505050");
    doc.setLineWidth(0.3);
    doc.line(x, y, pageWidth - x, y);
    y += 5;

    // Questions
    for (const question of section.questions) {
        const data = answers[question.id] || { answer: null, notes: "" };
        const noteText = data.notes.trim() || "None.";
        const noteLines = doc.splitTextToSize(noteText, boxWidth - 6);
        const boxHeight = 25 + 3.5 * noteLines.length;

        // Handle page breaking
        if (y + boxHeight > pageHeight - 12) {
            doc.addPage();
            y = 15;
        }

        // Container
        doc.setFillColor("#fff");
        doc.setDrawColor("#000");
        doc.rect(x, y, boxWidth, boxHeight, "FD");

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`${question.id}: ${question.name}`, x + 2, y + 6);

        // Response
        let buttonX = x + 2;
        const buttonY = y + 10;

        for (const response of form.responses) {
            const selected = response.id === data.answer;
            doc.setFillColor(selected ? response.colors.bg : "#fff");
            doc.setDrawColor(selected ? response.colors.bg : "#000");
            doc.setTextColor(selected ? response.colors.fg : "#000");

            const width = writeControlStatus(
                doc,
                response.text,
                buttonX,
                buttonY
            );
            buttonX += width + 3;
        }

        // Notes
        const notesY = y + 22;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor("#000");
        doc.text("Notes:", x + 2, notesY);

        doc.setFont("helvetica", "normal");
        doc.text(noteLines, x + 2, notesY + 4);

        y += boxHeight + 2;
    }

    return y + 15;
};

export const generateReport = (appState: AppState) => {
    if (!appState.selectedForm) return;

    const doc = new jsPDF({ compress: true });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const printLines = (
        lines: string[],
        x: number,
        options?: Record<string, string>
    ) => {
        let offset = 4 * lines.length;
        lines.forEach((line, index) => {
            if (index === 0) doc.setFont("helvetica", "bold");
            doc.text(line, x, height - offset, options);
            if (index === 0) doc.setFont("helvetica", "normal");
            offset -= 4;
        });
    };

    // Centered logo
    doc.addImage(logoPDF, (width - 100) / 2, (height - 17) / 3, 100, 17);

    // Title
    doc.setFont("helvetica", "bold");
    doc.text(
        `${appState.selectedForm.source} ${appState.selectedForm.name} Assessment`,
        width / 2,
        height / 3 + 34,
        { align: "center" }
    );

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(appState.company, width / 2, height / 3 + 50, { align: "center" });
    doc.text(appState.location, width / 2, height / 3 + 55, {
        align: "center"
    });

    // Assessors / POC
    const assessors = appState.assessors;
    if (!assessors.length) assessors.push("Nobody");

    doc.setFontSize(8);
    printLines(["Assessed By:", ...assessors], 5);
    printLines(
        ["Made For:", appState.pocName || "N/A", appState.pocEmail || "N/A"],
        width - 5,
        { align: "right" }
    );

    // Content
    doc.addPage();

    let y = 15;
    for (const section of appState.selectedForm.sections || []) {
        y = drawSection(
            appState.selectedForm,
            appState.currentAnswers,
            doc,
            section,
            10,
            y,
            200
        );
    }

    doc.save("shield.pdf");
};
