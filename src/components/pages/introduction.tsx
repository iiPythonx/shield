import { appState } from "../../lib/state";

export function Introduction() {
    return (
        <>
            <h2>Introduction</h2>
            <h3>About This Assessment</h3>
            <p>
                You are currently filling out a{" "}
                {appState.value.selectedForm?.name} form made by{" "}
                {appState.value.selectedForm?.source}.
            </p>
            <h3>How to Use</h3>
            <p>This assessment is split into three separate components:</p>
            <ul>
                <li>The Introduction (you are here)</li>
                <li>Preliminary Information</li>
                <li>Questions / Responses</li>
            </ul>
            <p>
                After moving past this page, you will hit the preliminary
                information section. This section is meant to intake information
                regarding who you're assessing, their contact information, and
                who is on your assessment team. Note that everything is
                optional.
            </p>
            <p>
                To move between pages, feel free to interact with the sidebar
                manually or use the <b>Previous</b> and <b>Next</b> buttons at
                the bottom of every page.
            </p>
        </>
    );
}
