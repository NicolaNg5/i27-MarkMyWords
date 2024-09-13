export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Raw Request Body:", req.body);

      const response = await fetch("http://localhost:8000/save_questions", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: req.body,
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to save questions" });
    }
  } else {
    res.status(405).end();
  }
}
