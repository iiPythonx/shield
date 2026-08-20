import { render } from "preact";
import { useRef, useState } from "preact/hooks";
import { parse } from "jsonc-parser";

import { Modal } from "./components/modal";
import { Assessment } from "./components/assessment";
import type { Form } from "./types";

import "./index.css";
import { useForm } from "./lib/state";

const form_data = Object.values(import.meta.glob("./assets/forms/*.jsonc", { query: "?raw", eager: true, import: "default" })).map((c) => parse(c)) as Form[];

export function App() {
    const [currentForm, setForm] = useForm();
    const [copyrightOpen, setCopyrightOpen] = useState<boolean>(false);
    const dropdownReference = useRef<HTMLSelectElement | null>(null);

    const continueWithSelectedType = () => {
        const select = dropdownReference.current
        if (!select) return;

        const form = form_data.find((form) => form.id === select.value);
        if (!form) return select.classList.add("invalid");

        setForm(form);
    }

    return <>
        {
            currentForm ? <Assessment /> : <Modal title = "Assessment Setup">
                <p>Please select the type of assessment you're conducting:</p>
                <select value = {""} ref = {dropdownReference}>
                    {form_data.map((form) => {
                        return <option value = {form.id}>{form.source} - {form.name}</option>;
                    })}
                </select>
                <button onClick = {continueWithSelectedType}>Continue</button>
            </Modal>
        }
        <footer onClick = {() => setCopyrightOpen(true)}>&copy; 2026</footer>
        {copyrightOpen && <Modal title = "Copyright & Credits">
            <p>Copyright &copy; 2026 Benjamin O'Brien</p>
            <p>Designed by the Mississippi State University Cybersecurity Assessments Program</p>
            <p>Made possible by <a href = "https://vite.dev">vite</a> and <a href = "https://preactjs.com">preact</a></p>
            <button onClick = {() => setCopyrightOpen(false)}>Close</button>
        </Modal>}
    </>;
}

render(<App />, document.getElementById("content")!);
