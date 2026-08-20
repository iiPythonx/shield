import { useState } from "preact/hooks";

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
    const [currentForm,] = useForm();
    if (!currentForm) return;
    
    const [currentItem, setCurrentItem] = useState<string>("intro");
    
    const questions = new Map<string, Question>();
    for (const section of currentForm.sections) {
        for (const question of section.questions) questions.set(question.id, question);
    }

    const questionKeys = [...questions.keys()];

    const next = () => {
        if (currentItem === "intro") return setCurrentItem("prelim");
        if (currentItem === "prelim") return setCurrentItem(questionKeys[0]);
        setCurrentItem(questionKeys[questionKeys.indexOf(currentItem) + 1]);
    }

    const prev = () => {
        if (currentItem === "intro") return;
        if (currentItem === "prelim") return setCurrentItem("intro");

        const index = questionKeys.indexOf(currentItem);
        if (index === 0) return setCurrentItem("prelim");

        setCurrentItem(questionKeys[index - 1]);
    }

    return <>
        <Navbar currentItem = {currentItem} setCurrentItem = {setCurrentItem} />
        <hr />
        <main className = {"flex"}>
            <header>
                <h2>{currentForm.source} - {currentForm.name}</h2>
            </header>
            <hr />
            <div className = {"flex scroll"}>
                {currentItem === "intro" ? <Introduction /> : currentItem === "prelim" ? <Preliminary /> : <QuestionPage question = {questions.get(currentItem)} />}
                <h3>Progress</h3>
                <div style = {{ display: "flex", gap: "10px" }}>
                    <button style = {{ flex: "1" }} disabled = {currentItem === "intro"} onClick = {prev}>Previous</button>
                    <button style = {{ flex: "1" }} disabled = {currentItem === questionKeys.at(-1)} onClick = {next}>Next</button>
                </div>
            </div>
        </main>
    </>
}
