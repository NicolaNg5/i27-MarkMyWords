export default async function handler(req, res) {
  const { assessmentid, prompt_key } = req.query;
  if (req.method === "GET") {
    try {
      const url = new URL("https://i27-markmywords.vercel.app/generate");
      url.searchParams.append("assessmentId", assessmentid);
      url.searchParams.append("prompt_key", prompt_key);

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate response" });
    }
  } else {
    res.status(405).end();
  }
}
