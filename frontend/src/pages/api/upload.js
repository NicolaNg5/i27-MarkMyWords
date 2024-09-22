export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const response = await fetch(
        "https://i27-markmywords.vercel.app/upload",
        {
          method: "POST",
          body: req.body,
        }
      );

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file" });
    }
  } else {
    res.status(405).end();
  }
}
