export enum QuestionType {
  MultipleChoice = "MCQ",
  FlashCard = "FC",
  Highlighting = "HL",
  ShortAnswer = "SA",
}

export enum QuestionCategory {
    Literal = "literal",
    Inferential = "inferential",
}
export interface Question {
    QuestionID: string;
    AssessmentID?: string;
    Question: string;
    Category?: QuestionCategory;
    Type: QuestionType;
    Options?: string[];
    Answer?: string;
}