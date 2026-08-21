import { effect, signal } from "@preact/signals";
import type { Form } from "../types";

export interface AnswerEntry {
    answer: number | null;
    notes: string;
}

export interface AppState {
    selectedForm: Form | null;
    currentAnswers: Record<string, AnswerEntry>;
    company: string;
    location: string;
    pocName: string;
    pocEmail: string;
    assessors: string[];
}

const defaultState: AppState = {
    selectedForm: null,
    currentAnswers: {},
    company: "",
    location: "",
    pocName: "",
    pocEmail: "",
    assessors: []
};

function loadState(): AppState {
    try {
        const stored = localStorage.getItem("assessment");
        return stored
            ? { ...defaultState, ...JSON.parse(stored) }
            : defaultState;
    } catch {
        return defaultState;
    }
}

export const appState = signal<AppState>(loadState());

export const clearState = () => {
    appState.value = defaultState;
};

effect(() => {
    localStorage.setItem("assessment", JSON.stringify(appState.value));
});
