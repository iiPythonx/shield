import type { ReactNode } from "preact/compat";

import { useAnswers, useForm } from "../lib/state";

import MSU from "../assets/icons/msstate.svg";
import "./navbar.css";

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

    const Item = (id: string, text: string) => {
        return <li onClick = {() => setCurrentItem(id)} className = {currentItem === id ? "selected" : ""}>{text}</li>;
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
    </aside>;
}
