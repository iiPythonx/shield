import { useRef } from "preact/hooks";

import { assessorsSignal, companySignal, locationSignal, pocEmailSignal, pocNameSignal } from "../../lib/state";

export function Preliminary() {
    const nameReference = useRef<HTMLInputElement | null>(null);
    
    const addAssessor = () => {
        if (!nameReference.current || !nameReference.current.value.trim()) return;
        assessorsSignal.value = [...assessorsSignal.value, nameReference.current.value];
        nameReference.current.value = "";
    }

    return <div className = {"flex"}>
        <h2>Preliminary Information</h2>
        <h3>Assessment Site</h3>

        <label>Company / Organization</label>
        <input 
            value = {companySignal.value} 
            onInput = {(e) => companySignal.value = e.currentTarget.value} 
        />

        <label>Location</label>
        <input 
            value = {locationSignal.value} 
            onInput = {(e) => locationSignal.value = e.currentTarget.value} 
        />

        <h3>Point of Contact</h3>

        <label>Name</label>
        <input 
            value = {pocNameSignal.value} 
            onInput = {(e) => pocNameSignal.value = e.currentTarget.value} 
        />

        <label>Email</label>
        <input 
            value = {pocEmailSignal.value} 
            onInput = {(e) => pocEmailSignal.value = e.currentTarget.value} 
        />

        <h3>Assessors</h3>
        {assessorsSignal.value.length ? <ul>{assessorsSignal.value.map(a => <li>{a}</li>)}</ul> : ""}
        <div style = {{ display: "flex", gap: "10px" }}>
            <input placeholder = "Assessor name" ref = {nameReference} />
            <button onClick = {addAssessor}>Add</button>
        </div>
    </div>;
}
