import type { ReactNode } from "preact/compat";

import "./navbar.css";
import MSU from "../assets/icons/msstate.svg";
import { useForm } from "../lib/state";

function Section({ name, children }: { name: string, children: ReactNode }) {
    return <li class = "navbar-section">
        {name}
        <ul>{children}</ul>
    </li>;
}

export function Navbar({ currentItem, setCurrentItem }: { currentItem: string, setCurrentItem: (item: string) => void }) {
    const [currentForm,] = useForm();
    if (!currentForm) return;

    const Item = (id: string, text: string) => {
        return <li onClick = {() => setCurrentItem(id)} className = {currentItem === id ? "selected" : ""}>{text}</li>;
    }

    return <aside className = {"flex"}>
        <img src = {MSU} style = {{ width: "300px" }} />
        <hr />
        <ul>
            {Item("intro", "Introduction")}
            {Item("prelim", "Preliminary Information")}
            {currentForm.sections.map((section) => (
                <Section name = {section.name}>
                    {section.questions.map((question) => Item(question.id, question.id))}
                </Section>
            ))}
        </ul>
        <div style = {{ flex: "1" }}></div>
        <button>Export (JSON)</button>
        <button>Export (PDF)</button>
    </aside>;
}
