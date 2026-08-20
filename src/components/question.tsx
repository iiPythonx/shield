import { useState } from "preact/hooks";

import { useForm } from "../lib/state";
import type { Question } from "../types";

function ResponseSelector() {
    const [form,] = useForm();
    const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
    return (
        <div style = {{ display: "flex", gap: "10px" }}>
            {form?.responses.map((response) => {
                const selected = response.id === selectedResponse;
                return (
                    <button
                        key = {response.id}
                        style = {{
                            color: selected ? response.colors.fg : undefined,
                            background: selected ? response.colors.bg : "none",
                            border: `1px solid ${response.colors.bg}`
                        }}
                        onClick = {() => setSelectedResponse(selected ? null : response.id)}
                    >
                        {response.text}
                    </button>
                );
            })}
        </div>
    );
}

export function QuestionPage({ question }: { question: Question | undefined }) {
    if (!question) return <p>Requested question was not found.</p>;
    return (
        <div className = {"flex"}>
            <h2>{question.id}: {question.name}</h2>
            {Object.entries(question.sections).map(([name, details]) => <>
                <h3>{name}</h3>
                <ul>
                    {details.map(d => <li>{d}</li>)}
                </ul>
            </>)}
            <hr />
            <h3>Assessment</h3>
            <ResponseSelector />
            <h3>Notes</h3>
            <textarea style = {{ color: "#000", outline: "none" }} />
        </div>
    );
}
