// pages/api/students.js or app/api/students/route.js

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { question_id, student_id, answer } = req.body;

    try {
      const response = await fetch(
        "https://i27-markmywords.vercel.app/student_answer/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //creating single obj from 3 props sent thru front end
          body: JSON.stringify({ question_id, student_id, answer }), //NExt.js auto parse the json string in transmit to js object so have to parse back to json string to send to post api
        }
      );

      const data = await response.json();

      if (response.ok) {
        res.status(201).json(data);
      } else {
        res.status(response.status).json(data);
      }
    } catch (error) {
      res
        .status(500)
        .json({ detail: "An error occurred while creating the student" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
