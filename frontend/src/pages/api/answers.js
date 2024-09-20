export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("API Route - Raw Request Body:", req.body); 

      const response = await fetch("http://localhost:8000/submit_answers", { 
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" }, 
        body: req.body 
      });

      const data = await response.json();
      res.status(200).json(data); 
    } catch (error) {
      console.error("Error submitting answers:", error);
      res.status(500).json({ error: 'Failed to submit answers' });
    }
  } else {
    res.status(405).end(); 
  }
}