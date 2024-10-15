import { Question } from "@/types/question";

interface MultipleChoiceProps {
    question: Question;
    studentAnswer?: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({question, studentAnswer}) => {
    const smalltext = question.Options?.reduce((total, str) => total + str.length, 0) as number > 50 ? "text-sm" : "text-md";
    const isCorrect = question.Answer === studentAnswer;

    return (
        <div className={`mt-2 text-gray-600 flex flex-col ${smalltext}`}>
            <div className="flex-grow">
                <div className="flex gap-2 px-3">
                    <p><b>Category:</b> {question.Category}</p>
                </div>
                {!studentAnswer && (
                    <div className="flex items-center">
                        {question.Options?.map((option, index) => ( 
                            <div key={option} className={`gap-2 px-3`}>
                                {index + 1}. {option}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-2 pt-3 px-3">
                    <p><b>Answer:</b> {question.Answer}</p>
                </div>
            </div>
            {studentAnswer && (
                <div className={`flex gap-2 mt-2 py-2 px-2 border rounded border-black ${isCorrect ? "bg-green-300" : "bg-red-300"}`}>
                    <p><b>Student Answer:</b> {studentAnswer}</p>
                </div>
            )}
        </div>
    )
}

export default MultipleChoice;