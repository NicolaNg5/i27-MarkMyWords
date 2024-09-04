export enum ImportanceLevel {
    High,
    Normal,
    Low
}

export interface Skill {
    id: string,
    name: string,
    importance: ImportanceLevel,
}