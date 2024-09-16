export enum QuestionType {
   MultipleChoice = "MCQ",
   FlashCard = "FC",
   Highlighting =  "HL",
   ShortAnswer = "SA",
}

export interface Question {
    id: string,
    assessmentID?: string,
    question: string,
    category?: string,
    type: QuestionType,
    options?: string[],
    content?: string
}
