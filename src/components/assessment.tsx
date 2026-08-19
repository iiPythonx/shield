import { useState } from "preact/hooks";
import Icon from "../assets/icons/msstate_horizontal_white.svg";
import type { Form, Section, Question, Response } from "../types";

function ResponseSelector({ responses }: { responses: Response[] }) {
    const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
    return <div style = {{ display: "flex", gap: "10px" }}>
        {responses.map((response) => {
            return (
                <button
                    style = {{
                        color: response.id === selectedResponse ? response.colors.fg : null,
                        background: response.id === selectedResponse ? response.colors.bg : "none",
                        border: `1px solid ${response.colors.bg}`
                    }}
                    onClick = {() => {
                        setSelectedResponse(selectedResponse === response.id ? null : response.id);
                    }}
                >
                    {response.text}
                </button>
            )
        })}
    </div>;
}

function Question({ form, question }: { form: Form, question: Question }) {
    return <div className = {"flex question"}>
        <h4>{question.id}: {question.name}</h4>
        {/* <details>
            <summary>Notes</summary>
            <textarea />
        </details> */}
        <ResponseSelector responses = {form.responses} />
    </div>;
}

function Section({ form, section }: { form: Form, section: Section }) {
    return <details className = {"flex"}>
        <summary class = "section-title">{section.name} ({section.id})</summary>
        <div className = {"flex"}>{section.questions.map((q) => <Question form = {form} question = {q} />)}</div>
    </details>;
}

export function Assessment({ form }: { form: Form }) {
    return <>
        <aside>
            <img src = {Icon} style = {{ width: "300px" }} />
        </aside>
        <hr />
        <main className = {"flex"}>
            <header>
                <h2>{form.source} - {form.name}</h2>
            </header>
            <hr />
            <div className = {"flex scroll"}>
                {form.sections.map((section) => <Section form = {form} section = {section} />)}
            </div>
        </main>
    </>
}
