export type Question = {
    id: string;
    name: string;
    sections: Record<string, string[]>;
}

export type Response = {
    id: number;
    colors: {
        fg: string;
        bg: string;
    };
    text: string;
}

export type Section = {
    id: number;
    name: string;
    questions: Question[]
}

export type Form = {
    id: string;
    name: string;
    source: string;
    responses: Response[];
    sections: Section[];
}
