import { signal } from "@preact/signals";
import type { Form } from "../types";

export const selectedForm = signal<Form | null>(null);

export function useForm(): [Form | null, (form: Form) => void] {
    return [
        selectedForm.value,
        (form: Form) => { selectedForm.value = form; }
    ];
}
