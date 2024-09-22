// pages/api/students.js or app/api/students/route.js

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        const response = await fetch("http://localhost:8000/assessment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body), 
        });
  
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
  