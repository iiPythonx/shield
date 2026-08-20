import { useState } from "preact/hooks";
import Icon from "../assets/icons/msstate_horizontal_white.svg";
import type { Form, Section, Question, Response } from "../types";

type AnswerResponse = {
    response: number | null;
    notes: string;
};

function ResponseSelector({
    responses,
    selectedResponse,
    onSelect
}: {
    responses: Response[],
    selectedResponse: number | null,
    onSelect: (response: number | null) => void
}) {
    return (
        <div style = {{ display: "flex", gap: "10px" }}>
            {responses.map((response) => {
                const selected = response.id === selectedResponse;
                return (
                    <button
                        key = {response.id}
                        style = {{
                            color: selected ? response.colors.fg : undefined,
                            background: selected ? response.colors.bg : "none",
                            border: `1px solid ${response.colors.bg}`
                        }}
                        onClick = {() => onSelect(selected ? null : response.id)}
                    >
                        {response.text}
                    </button>
                );
            })}
        </div>
    );
}

function Question({ 
    form,
    question,
    answer,
    onResponseSelect,
    onNotesChange
}: {
    form: Form,
    question: Question,
    answer: AnswerResponse,
    onResponseSelect: (response: number | null) => void,
    onNotesChange: (notes: string) => void
}) {
    return <div className = {"flex question"}>
        <details>
            <summary className = {"section-title"}>{question.id}: {question.name}</summary>
            <div className = {"flex"}>
                <div style = {{ display: "flex", gap: "10px" }}>
                    {Object.entries(question.attributes).map(([name, value]) => <span>{name}: <b>{value}</b></span>)}
                </div>
                <ul>
                    {question.details.map((detail) => <li>{detail}</li>)}
                </ul>
                <details>
                    <summary>Additional notes</summary>
                    <textarea 
                        style = {{ color: "#000", outline: "none" }} 
                        value = {answer.notes}
                        onInput = {(e) => onNotesChange((e.target as HTMLTextAreaElement).value)}
                    />
                </details>
                <ResponseSelector 
                    responses = {form.responses} 
                    selectedResponse = {answer.response}
                    onSelect = {onResponseSelect}
                />
            </div>
        </details>
    </div>;
}

function Section({
    form,
    section,
    answers,
    onUpdateQuestion
}: {
    form: Form,
    section: Section,
    answers: Record<string | number, AnswerResponse>,
    onUpdateQuestion: (id: string | number, updates: Partial<AnswerResponse>) => void
}) {
    return <details className = {"flex"}>
        <summary class = "section-title">{section.name} ({section.id})</summary>
        <div className = {"flex"}>{section.questions.map((q) => (
            <Question 
                key = {q.id}
                form = {form} 
                question = {q} 
                answer = {answers[q.id] || { response: null, notes: "" }}
                onResponseSelect = {(response) => onUpdateQuestion(q.id, { response })}
                onNotesChange = {(notes) => onUpdateQuestion(q.id, { notes })}
            />
        ))}</div>
    </details>;
}

export function Assessment({ form }: { form: Form }) {
    const [formAnswers, setFormAnswers] = useState<Record<string | number, AnswerResponse>>({});

    const updateQuestion = (questionId: string | number, updates: Partial<AnswerResponse>) => {
        setFormAnswers(prev => {
            const currentAnswer = prev[questionId] || { response: null, notes: "" };
            return {
                ...prev,
                [questionId]: { ...currentAnswer, ...updates }
            };
        });
    };

    const submitAssessment = () => {
        console.log(form.sections.reduce((acc, section) => {
            section.questions.forEach((q) => {
                acc[q.id] = formAnswers[q.id] || { response: null, notes: "" };
            });
            return acc;
        }, {} as Record<string | number, AnswerResponse>));
    };

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
                {form.sections.map((section) => (
                    <Section 
                        key = {section.id} 
                        form = {form} 
                        section = {section} 
                        answers = {formAnswers}
                        onUpdateQuestion = {updateQuestion}
                    />
                ))}
                <button onClick = {submitAssessment}>Submit</button>
            </div>
        </main>
    </>
}
