// pages/api/quiz.js
export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const response = await fetch('http://localhost:8000/quiz'); 
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        res.status(500).json({ error: "Failed to fetch quiz questions" });
      }
    } else {
      res.status(405).end();
    }
  }