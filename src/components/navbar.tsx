import { useState, type ReactNode } from "preact/compat";

import { Modal } from "./modal";
import { logoMain } from "../../branding.json";
import { appState, clearState } from "../lib/state";
import { generateReport } from "../lib/pdf";

import "./navbar.css";

function Section({ name, children }: { name: string; children: ReactNode }) {
    return (
        <div>
            {name}
            <div class="list">{children}</div>
        </div>
    );
}

export function Navbar({
    currentItem,
    setCurrentItem
}: {
    currentItem: string;
    setCurrentItem: (item: string) => void;
}) {
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

    const Item = (
        id: string,
        text: string,
        questionId?: string | undefined
    ) => {
        const hasNotes =
            questionId &&
            appState.value.currentAnswers[questionId]?.notes.trim();
        const hasResponse =
            questionId && appState.value.currentAnswers[questionId]?.answer;
        return (
            <div
                onClick={() => setCurrentItem(id)}
                className={
                    currentItem === id ? "list-item selected" : "list-item"
                }
            >
                {questionId &&
                    (hasNotes && hasResponse ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={"active"}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={hasResponse || hasNotes ? "active" : ""}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                        >
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                        </svg>
                    ))}
                <span>{text}</span>
            </div>
        );
    };

    return (
        <aside className={"flex"}>
            <img
                src={logoMain}
                style={{ width: "300px", alignSelf: "center" }}
            />
            <hr />
            <div class="list">
                {Item("intro", "Introduction")}
                {Item("prelim", "Preliminary Information")}
                {appState.value.selectedForm?.sections.map((section) => (
                    <Section name={section.name}>
                        {section.questions.map((question) =>
                            Item(
                                question.id,
                                `${question.id}: ${question.name}`,
                                question.id
                            )
                        )}
                    </Section>
                ))}
            </div>
            <div style={{ flex: "1" }}></div>
            <button onClick={() => generateReport(appState.value)}>
                Export (PDF)
            </button>
            <button onClick={() => setConfirmModalOpen(true)}>
                Clear Assessment
            </button>
            {confirmModalOpen && (
                <Modal title={"Confirm Assessment Clearing"}>
                    <p>
                        Are you sure you want to clear the assessment?{" "}
                        <b>This cannot be undone.</b>
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "end"
                        }}
                    >
                        <button onClick={() => setConfirmModalOpen(false)}>
                            Cancel
                        </button>
                        <button onClick={clearState}>Confirm</button>
                    </div>
                </Modal>
            )}
        </aside>
    );
}
