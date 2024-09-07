import { Student } from '@/types/student';
import React, { useState } from 'react';

interface StudentListProps {
  students: Student[];
  onDeleteStudent?: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onDeleteStudent }) => {

  return (
    <>
    <div>
        <div className="bg-secondary p-4 rounded-md mb-0">
            <h2 className="text-lg font-bold">Manage Students</h2>
        </div>
        <div className="border border-gray-100 bg-gray-100 p-1 pt-0">
            <ul className="mt-2">
                {students.map((student) => (
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