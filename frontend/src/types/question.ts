export enum QuestionType {
  MultipleChoice = "MCQ",
  FlashCard = "FC",
  Highlighting = "HL",
  ShortAnswer = "SA",
}

export interface Question {
  QuestionID: string;
  AssessmentID?: string;
  Question: string;
  Category?: string;
  Type: QuestionType;
  Options?: string[];
  Answer: string;
}
