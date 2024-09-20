export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const response = await fetch("http://localhost:8000/analyse_answers", {
          method: "POST",
        });
  
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error("Error analysing answers:", error);
        res.status(500).json({ error: "Failed to analyse answers" });
      }
    } else {
      res.status(405).end();
    }
  }