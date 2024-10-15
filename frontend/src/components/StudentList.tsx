import { Student } from '@/types/student';

interface StudentListProps {
  students: Student[];
  onDeleteStudent?: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onDeleteStudent }) => {
  const sortedStudents = students?.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
    <div>
        <div className="bg-secondary p-4 rounded-md mb-0">
            <h2 className="text-lg font-bold">Manage Students</h2>
        </div>
        <div className="overflow-y-auto border border-gray-100 bg-gray-100 p-1 pt-0" style={{ height: "400px" }}>
            <ul className="mt-2">
                {sortedStudents?.map((student) => (
                <li key={student.name} className="flex items-center justify-between py-2 px-4 border-b m-1 border-gray-100 rounded-md bg-gray-300 hover:bg-gray-400">
                    <div className="flex items-center">
                        <span>{student.name}</span>
                    </div>
                    <button
                    className="text-red-500 hover:text-red-600"
                    //   onClick={() => onDeleteStudent(student.name)}
                    >
                    X
                    </button>
                </li>
                ))}
            </ul>
        </div>
    </div>
    </>
  );
};

export default StudentList;