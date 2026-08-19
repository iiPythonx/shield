import type { ReactNode } from "preact/compat";

import "./modal.css";

export function Modal({ title, children }: { title: string, children: ReactNode }) {
    return <div id = "modal">
        <div className = {"modal-box flex"}>
            <h3>{title}</h3>
            <hr />
            {children}
        </div>
    </div>
}
