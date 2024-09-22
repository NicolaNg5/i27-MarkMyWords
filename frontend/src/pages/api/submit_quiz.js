export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("API Route - Request Body:", req.body);

      const response = await fetch(
        "https://i27-markmywords.vercel.app/submit_quiz",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: req.body,
        }
      );

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error submitting quiz data:", error);
      res.status(500).json({ error: "Failed to submit quiz data" });
    }
  } else {
    res.status(405).end();
  }
}
