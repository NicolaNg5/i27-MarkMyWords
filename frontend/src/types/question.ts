export enum QuestionType {
  MultipleChoice = "MCQ",
  FlashCard = "FC",
  Highlighting = "HL",
  ShortAnswer = "SA",
}

export enum QuestionCategory {
    Literal = "Literal",
    Inferential = "Inferential",
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