"use client";
import { useState, useEffect } from "react";
import supabase from "../../../../backend/lib/supabaseClient";

export default function TestSupabase() {
  const [fetchError, setFetchError] = useState(null);
  const [students, setStudents] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("student").select();

      if (error) {
        setFetchError("Could not fetch Student table");
        setStudents(null);
        console.log(error);
      }

      if (data) {
        setStudents(data);
        setFetchError(null);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Student Table: </h1>
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      {students && (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left text-black font-semibold">
                Name
              </th>
              <th className="py-2 px-4 border-b text-left text-black font-semibold">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-black">
                  {student.name}
                </td>
                <td className="py-2 px-4 border-b text-black">
                  {student.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
