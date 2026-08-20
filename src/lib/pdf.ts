import { jsPDF } from "jspdf";
import MSU from "../assets/icons/msstate_maroon.png";

import type { AppState } from "./state";

export const generateReport = (appState: AppState) => {
    const doc = new jsPDF();
    doc.addImage(MSU, 10, 10, 100, 17);
    doc.save("shield.pdf");
    console.log(appState);
}