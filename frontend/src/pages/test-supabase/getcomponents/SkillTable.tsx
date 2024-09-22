import React from "react";
import styles from "@/pages/test-supabase/testsupabase.module.css";
import { Skill } from "@/types/skill";
//Skill table comp
export default function SkillTable({ skills }: { skills: Skill[] }) {
  if (!skills.length) return <p>No Skills found.</p>;
  return (
    <>
      <br></br>
      <h2>All Skills:</h2>
      <table className={styles["student-table"]}>
        <thead>
          <tr>
            <th>Skill ID</th>
            <th>Name</th>
            <th>Importance</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill: Skill) => (
            <tr key={skill.skillid}>
              <td>{skill.skillid}</td>
              <td>{skill.name}</td>
              <td>{skill.importance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
