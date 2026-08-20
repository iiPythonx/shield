import { useMemo, useState } from "preact/hooks";

import type { Question } from "./types";
import { appState } from "./lib/state";
import { Navbar } from "./components/navbar";
import { QuestionPage } from "./components/pages/question";
import { Introduction } from "./components/pages/introduction";
import { Preliminary } from "./components/pages/preliminary";

export function Assessment() {
    const [currentItem, setCurrentItem] = useState<string>("intro");
    
    // Process questions
    const { questions, steps } = useMemo(() => {
        if (!appState.value.selectedForm) return { questions: new Map<string, Question>(), steps: ["intro", "prelim"] };

        const map = new Map<string, Question>();
        for (const section of appState.value.selectedForm.sections) {
            for (const question of section.questions) map.set(question.id, question);
        }

        return {
            questions: map,
            steps: ["intro", "prelim", ...map.keys()],
        };
    }, [appState.value.selectedForm]);

    if (!appState.value.selectedForm) return null;

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
                <h2>{appState.value.selectedForm.source} - {appState.value.selectedForm.name}</h2>
            </header>
            <hr />
            <div className = {"flex scroll"} style = {{ flex: "1" }}>
                {currentItem === "intro" ? (
                    <Introduction />
                ) : currentItem === "prelim" ? (
                    <Preliminary />
                ) : (
                    <QuestionPage question = {questions.get(currentItem)} />
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
