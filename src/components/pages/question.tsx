import { appState } from "../../lib/state";
import type { Question } from "../../types";

function ResponseSelector({ answer, setAnswer }: { question: string, answer: number | null, setAnswer: (a: number | null) => void }) {
    return (
        <div style = {{ display: "flex", gap: "10px" }}>
            {appState.value.selectedForm?.responses.map((response) => {
                const selected = response.id === answer;
                return (
                    <button
                        key = {response.id}
                        style = {{
                            color: selected ? response.colors.fg : undefined,
                            background: selected ? response.colors.bg : "none",
                            border: `1px solid ${response.colors.bg}`
                        }}
                        onClick = {() => setAnswer(selected ? null : response.id)}
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
    const data = appState.value.currentAnswers[question.id] || { answer: null, notes: "" };

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
            <ResponseSelector question = {question.id} answer = {data.answer} setAnswer = {(a: number | null) => {
                appState.value = {
                    ...appState.value,
                    currentAnswers: {
                        ...appState.value.currentAnswers,
                        [question.id]: { ...data, answer: a }
                    }
                }
            }} />
            <h3>Notes</h3>
            <textarea
                onInput = {(e) => {
                    appState.value = {
                        ...appState.value,
                        currentAnswers: {
                            ...appState.value.currentAnswers,
                            [question.id]: { ...data, notes: e.currentTarget.value }
                        }
                    }
                }}
                value = {data.notes}
            />
        </div>
    );
}
