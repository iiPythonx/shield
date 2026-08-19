import { render } from "preact";
import { useRef, useState } from "preact/hooks";
import { parse } from "jsonc-parser";

import { Modal } from "./components/modal";
import { Assessment } from "./components/assessment";
import type { Form } from "./types";

import "./index.css";

const form_data = Object.values(import.meta.glob("./assets/forms/*.jsonc", { query: "?raw", eager: true, import: "default" })).map((c) => parse(c)) as Form[];

export function App() {
    const [currentForm, setForm] = useState<Form | null>(null);
    const dropdownReference = useRef<HTMLSelectElement | null>(null);

    const continueWithSelectedType = () => {
        const select = dropdownReference.current
        if (!select) return;

        const form = form_data.find((form) => form.id === select.value);
        if (!form) return select.classList.add("invalid");

        setForm(form);
    }

    return currentForm ? <Assessment form = {currentForm} /> : <Modal title = "Assessment Setup">
        <p>Please select the type of assessment you're conducting:</p>
        <select value = {""} ref = {dropdownReference}>
            {form_data.map((form) => {
                return <option value = {form.id}>{form.source} - {form.name}</option>;
            })}
        </select>
        <button onClick = {continueWithSelectedType}>Continue</button>
    </Modal>;
}

render(<App />, document.getElementById("content")!);
