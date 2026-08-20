import { useForm, useAnswers } from "../lib/state";
import type { Question } from "../types";

function ResponseSelector({ question, answer, setAnswer }: { question: string, answer: number | null, setAnswer: (q: string, a: number | null) => void }) {
    const [form] = useForm();
    return (
        <div style = {{ display: "flex", gap: "10px" }}>
            {form?.responses.map((response) => {
                const selected = response.id === answer;
                return (
                    <button
                        key = {response.id}
                        style = {{
                            color: selected ? response.colors.fg : undefined,
                            background: selected ? response.colors.bg : "none",
                            border: `1px solid ${response.colors.bg}`
                        }}
                        onClick = {() => setAnswer(question, selected ? null : response.id)}
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

    // Fetch answer data
    const { answers, setAnswer, setNote } = useAnswers();
    const data = answers[question.id] || { answer: null, notes: "" };

    // Component
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
            <ResponseSelector question = {question.id} answer = {data.answer} setAnswer = {setAnswer} />
            <h3>Notes</h3>
            <textarea
                style = {{ color: "#000", outline: "none" }}
                onInput = {(e) => setNote(question.id, e.currentTarget.value)}
                value = {data.notes}
            />
        </div>
    );
}
