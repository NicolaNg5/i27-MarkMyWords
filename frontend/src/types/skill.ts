export enum ImportanceLevel {
  High,
  Normal,
  Low,
}

export interface Skill {
  skillid: string;
  name: string;
  importance: ImportanceLevel;
}
