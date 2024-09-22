export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const response = await fetch(
        "https://i27-markmywords.vercel.app/questionskills"
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  } else {
    res.status(405).end();
  }
}
