import { jsPDF } from "jspdf";
import MSU from "../assets/images/msstate_maroon.png";

import type { AnswerEntry, AppState } from "./state";
import type { Form, Section } from "../types";

const writeControlStatus = (doc: jsPDF, text: string, x: number, y: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const width = doc.getTextWidth(text) + 8;
    const height = 7;

    doc.roundedRect(x, y, width, height, 1, 1, "FD");
    doc.text(text, x + 4, y + 4.8);

    return width;
}

const drawSection = (form: Form, answers: Record<string, AnswerEntry>, doc: jsPDF, section: Section, x: number, y: number, pageWidth: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#000");

    // Header
    doc.text(section.name, x, y);
    y += 4;

    // Separator
    doc.setDrawColor("#505050");
    doc.setLineWidth(0.3);
    doc.line(x, y, pageWidth - x, y);
    y += 5;

    // Fill out questions
    for (const question of section.questions) {
        const boxHeight = 23;

        // Box
        doc.setFillColor("#fff");
        doc.setDrawColor("#000");
        doc.rect(x, y, pageWidth - x * 2, boxHeight, "FD");

        // Item title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor("#000");

        doc.text(
            `${question.id}: ${question.name}`,
            x + 2,
            y + 6
        );

        // Response indication
        let buttonX = x + 2;
        const buttonY = y + 10;

        for (const response of form.responses) {
            if (response.id === (answers[question.id] || { answer: null, notes: "" }).answer) {
                doc.setFillColor(response.colors.bg);
                doc.setDrawColor(response.colors.bg);
                doc.setTextColor(response.colors.fg)
            } else {
                doc.setFillColor("#fff");
                doc.setDrawColor("#000");
                doc.setTextColor("#000");
            }

            const width = writeControlStatus(
                doc,
                response.text,
                buttonX,
                buttonY
            );
            buttonX += width + 3;
        }

        y += boxHeight + 2;

        // New page
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    };

    return y;
}

export const generateReport = (appState: AppState) => {
    if (!appState.selectedForm) return;
    const doc = new jsPDF();

    // Sizing
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const printLines = (lines: string[], x: number, options?: Record<string, string>) => {
        let offset = 4 * lines.length;
        for (const line of lines) {
            if (line === lines[0]) doc.setFont("helvetica", "bold");
            doc.text(line, x, height - offset, options);
            doc.setFont("helvetica", "normal");
            offset -= 4;
        }
    }

    // Centered logo
    doc.addImage(
        MSU,
        (width - 100) / 2,
        (height - 17) / 3,
        100,
        17
    );

    // Title
    doc.setFont("helvetica", "bold");
    doc.text(
        `${appState.selectedForm.source} ${appState.selectedForm.name} Assessment`,
        width / 2,
        (height / 3) + (17 * 2),
        { align: "center" }
    )

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    doc.text(
        appState.company,
        width / 2,
        (height / 3) + 50,
        { align: "center" }
    )

    doc.text(
        appState.location,
        width / 2,
        (height / 3) + 55,
        { align: "center" }
    )

    // Assessors
    doc.setFontSize(8);
    printLines(["Assessed By:", ...appState.assessors], 5);
    printLines(["Made For:", appState.pocName, appState.pocEmail], width - 5, { align: "right" });

    // Next page and then start writing sections
    doc.addPage();

    let y = 20;
    for (const section of appState.selectedForm.sections || []) {
        y = drawSection(
            appState.selectedForm,
            appState.currentAnswers,
            doc,
            section,
            10,
            y,
            200
        ) + 5;
    }

    doc.save("shield.pdf");
}