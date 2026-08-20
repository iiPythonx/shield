import { useMemo, useState } from "preact/hooks";

import { Navbar } from "./navbar";
import type { Question } from "../types";
import { QuestionPage } from "./question";
import { useForm } from "../lib/state";

function Introduction() {
    return <p>Introduction!</p>;
}

function Preliminary() {
    return <p>Preliminary!</p>;
}

export function Assessment() {
    const [currentForm] = useForm();
    const [currentItem, setCurrentItem] = useState<string>("intro");
    
    // Process questions
    const { questions, steps } = useMemo(() => {
        if (!currentForm) return { questions: new Map<string, Question>(), steps: ["intro", "prelim"] };

        const map = new Map<string, Question>();
        for (const section of currentForm.sections) {
            for (const question of section.questions) map.set(question.id, question);
        }

        return {
            questions: map,
            steps: ["intro", "prelim", ...map.keys()],
        };
    }, [currentForm]);

    if (!currentForm) return null;

    // Handle stepping
    const currentIndex = steps.indexOf(currentItem);
    const next = () => {
        if (currentIndex < steps.length - 1) setCurrentItem(steps[currentIndex + 1]);
    };
    const prev = () => {
        if (currentIndex > 0) setCurrentItem(steps[currentIndex - 1]);
    };

    return <>
        <Navbar currentItem = {currentItem} setCurrentItem = {setCurrentItem} />
        <hr />
        <main className = {"flex"}>
            <header>
                <h2>{currentForm.source} - {currentForm.name}</h2>
            </header>
            <hr />
            <div className = {"flex scroll"}>
                {currentItem === "intro" ? (
                    <Introduction />
                ) : currentItem === "prelim" ? (
                    <Preliminary />
                ) : (
                    <QuestionPage question={questions.get(currentItem)} />
                )}
                <h3>Progress</h3>
                <div style = {{ display: "flex", gap: "10px" }}>
                    <button style = {{ flex: "1" }} disabled = {currentIndex <= 0} onClick = {prev}>Previous</button>
                    <button style = {{ flex: "1" }} disabled = {currentIndex >= steps.length - 1} onClick = {next}>Next</button>
                </div>
            </div>
        </main>
    </>
}
