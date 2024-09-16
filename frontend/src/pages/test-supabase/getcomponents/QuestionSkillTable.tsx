import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { QuestionSkill } from "@/types/questionSkill";
//Question SKill table comp
export default function QuestionSkillsTable({
  questionSkills,
}: {
  questionSkills: QuestionSkill[];
}) {
  if (!questionSkills.length) return <p>No Question Skills found.</p>;
  return (
    <>
      <br></br>
      <h2>All Question Skills:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Skill ID</th>
          </tr>
        </thead>
        <tbody>
          {questionSkills.map((questionskill: QuestionSkill) => (
            <tr>
              <td>{questionskill.QuestionID}</td>
              <td>{questionskill.SkillID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
