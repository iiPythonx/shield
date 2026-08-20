import { useState, type ReactNode } from "preact/compat";

import { useAnswers, useForm } from "../lib/state";

import MSU from "../assets/icons/msstate.svg";
import "./navbar.css";
import { Modal } from "./modal";

function Section({ name, children }: { name: string, children: ReactNode }) {
    return <li class = "navbar-section">
        {name}
        <ul>{children}</ul>
    </li>;
}

export function Navbar({ currentItem, setCurrentItem }: { currentItem: string, setCurrentItem: (item: string) => void }) {
    const [currentForm] = useForm();
    if (!currentForm) return null;

    const { answers } = useAnswers();
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

    const Item = (id: string, text: string) => {
        return <li onClick = {() => setCurrentItem(id)} className = {currentItem === id ? "selected" : ""}>{text}</li>;
    }

    const clearAssessment = () => {
        localStorage.clear();
        window.location.reload();
    }

    return <aside className = {"flex"}>
        <img src = {MSU} />
        <hr />
        <ul>
            {Item("intro", "Introduction")}
            {Item("prelim", "Preliminary Information")}
            {currentForm.sections.map((section) => (
                <Section name = {section.name}>
                    {section.questions.map((question) => Item(question.id, `${question.id}: ${question.name}`))}
                </Section>
            ))}
        </ul>
        <div style = {{ flex: "1" }}></div>
        <button onClick = {() => console.log(answers)}>Export (JSON)</button>
        <button>Export (PDF)</button>
        <button onClick = {() => setConfirmModalOpen(true)}>Clear Assessment</button>
        {confirmModalOpen && <Modal title = {"Confirm Assessment Clearing"}>
            <p>Are you sure you want to clear the assessment? <b>This cannot be undone.</b></p>
            <div style = {{ display: "flex", gap: "10px", justifyContent: "end" }}>
                <button onClick = {() => setConfirmModalOpen(false)}>Cancel</button>    
                <button onClick = {clearAssessment}>Confirm</button>
            </div>
        </Modal>}
    </aside>;
}
