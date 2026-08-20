import { signal } from "@preact/signals";
import type { Form } from "../types";

export const selectedForm = signal<Form | null>(null);

export function useForm(): [Form | null, (form: Form) => void] {
    return [
        selectedForm.value,
        (form: Form) => { selectedForm.value = form; }
    ];
}

export interface AnswerEntry {
    answer: number | null;
    notes: string;
}

export const currentAnswers = signal<Record<string, AnswerEntry>>({});

export function useAnswers() {
    const setAnswer = (question: string, answer: number | null) => {
        const current = currentAnswers.value[question] || { answer: null, notes: "" };
        currentAnswers.value = {
            ...currentAnswers.value,
            [question]: { ...current, answer }
        };
    };

    const setNote = (question: string, notes: string) => {
        const current = currentAnswers.value[question] || { answer: null, notes: "" };
        currentAnswers.value = {
            ...currentAnswers.value,
            [question]: { ...current, notes }
        };
    };

    return {
        answers: currentAnswers.value,
        setAnswer,
        setNote,
    };
}
