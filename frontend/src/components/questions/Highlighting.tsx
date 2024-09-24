import { Question } from "@/types/question";

interface HighlightingProps {
    question: Question;
    studentAnswer?: string;
}

const Highlighting: React.FC<HighlightingProps> = ({question, studentAnswer}) => {
    const smalltext = question.Options?.reduce((total, str) => total + str.length, 0) as number > 50 ? "text-sm" : "text-md";

    return (
        <div className={`mt-2 text-gray-600 ${smalltext}`}>
            <div className="flex gap-2 pb-3 px-3">
                <p><b>Category:</b> {question.Category}</p>
            </div>
            <div className="gap-2 px-3">
                <p><b>Suggested Highlighted Section:</b> {question.Answer}</p>
            </div>
            {studentAnswer && (
                <>
                    <div className={`flex gap-2 mt-2 py-2 px-2 border border-black`}>
                        <p><b>Student Answer:</b> {studentAnswer}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default Highlighting;