import { effect, signal } from "@preact/signals";
import type { Form } from "../types";

const load = <T>(key: string, fallback: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch { return fallback; }
};

export const selectedForm = signal<Form | null>(load("selectedForm", null));
export const currentAnswers = signal<Record<string, AnswerEntry>>(load("currentAnswers", {}));

export const companySignal = signal<string>(load("companySignal", ""));
export const locationSignal = signal<string>(load("locationSignal", ""));
export const pocNameSignal = signal<string>(load("pocNameSignal", ""));
export const pocEmailSignal = signal<string>(load("pocEmailSignal", ""));
export const assessorsSignal = signal<string[]>(load("assessorsSignal", []));

effect(() => {
    localStorage.setItem("selectedForm", JSON.stringify(selectedForm.value));
    localStorage.setItem("currentAnswers", JSON.stringify(currentAnswers.value));
    localStorage.setItem("companySignal", JSON.stringify(companySignal.value));
    localStorage.setItem("locationSignal", JSON.stringify(locationSignal.value));
    localStorage.setItem("pocNameSignal", JSON.stringify(pocNameSignal.value));
    localStorage.setItem("pocEmailSignal", JSON.stringify(pocEmailSignal.value));
    localStorage.setItem("assessorsSignal", JSON.stringify(assessorsSignal.value));
});

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
