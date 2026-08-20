import { useState, type ReactNode } from "preact/compat";

import { Modal } from "./modal";
import { logoMain } from "../../branding.json"
import { appState, clearState } from "../lib/state";
import { generateReport } from "../lib/pdf";

import "./navbar.css";

function Section({ name, children }: { name: string, children: ReactNode }) {
    return <li class = "navbar-section">
        {name}
        <ul>{children}</ul>
    </li>;
}

export function Navbar({ currentItem, setCurrentItem }: { currentItem: string, setCurrentItem: (item: string) => void }) {
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

    const Item = (id: string, text: string) => {
        return <li onClick = {() => setCurrentItem(id)} className = {currentItem === id ? "selected" : ""}>{text}</li>;
    }

    return <aside className = {"flex"}>
        <img src = {logoMain} style = {{ width: "300px", alignSelf: "center" }} />
        <hr />
        <ul>
            {Item("intro", "Introduction")}
            {Item("prelim", "Preliminary Information")}
            {appState.value.selectedForm?.sections.map((section) => (
                <Section name = {section.name}>
                    {section.questions.map((question) => Item(question.id, `${question.id}: ${question.name}`))}
                </Section>
            ))}
        </ul>
        <div style = {{ flex: "1" }}></div>
        <button onClick = {() => generateReport(appState.value)}>Export (PDF)</button>
        <button onClick = {() => setConfirmModalOpen(true)}>Clear Assessment</button>
        {confirmModalOpen && <Modal title = {"Confirm Assessment Clearing"}>
            <p>Are you sure you want to clear the assessment? <b>This cannot be undone.</b></p>
            <div style = {{ display: "flex", gap: "10px", justifyContent: "end" }}>
                <button onClick = {() => setConfirmModalOpen(false)}>Cancel</button>    
                <button onClick = {clearState}>Confirm</button>
            </div>
        </Modal>}
    </aside>;
}
