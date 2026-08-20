import { useRef } from "preact/hooks";

import { appState } from "../../lib/state";

export function Preliminary() {
    const nameReference = useRef<HTMLInputElement | null>(null);
    
    const addAssessor = () => {
        if (!nameReference.current || !nameReference.current.value.trim()) return;
        appState.value = {
            ...appState.value,
            assessors: [...appState.value.assessors, nameReference.current.value]
        };
        nameReference.current.value = "";
    }

    return <div className = {"flex"}>
        <h2>Preliminary Information</h2>
        <h3>Assessment Site</h3>

        <label>Company / Organization</label>
        <input 
            value = {appState.value.company} 
            onInput = {(e) => appState.value = { ...appState.value, company: e.currentTarget.value }} 
        />

        <label>Location</label>
        <input 
            value = {appState.value.location} 
            onInput = {(e) => appState.value = { ...appState.value, location: e.currentTarget.value }} 
        />

        <h3>Point of Contact</h3>

        <label>Name</label>
        <input 
            value = {appState.value.pocName} 
            onInput = {(e) => appState.value = { ...appState.value, pocName: e.currentTarget.value }} 
        />

        <label>Email</label>
        <input 
            value = {appState.value.pocEmail} 
            onInput = {(e) => appState.value = { ...appState.value, pocEmail: e.currentTarget.value }} 
        />

        <h3>Assessors</h3>
        {appState.value.assessors.length ? <ul>{appState.value.assessors.map(a => <li>{a}</li>)}</ul> : ""}
        <div style = {{ display: "flex", gap: "10px" }}>
            <input placeholder = "Assessor name" ref = {nameReference} />
            <button onClick = {addAssessor}>Add</button>
        </div>
    </div>;
}
