export default async function handler(req, res) {
    const { assessmentId } = req.query;
    if (req.method === 'POST') {
      try {
        const url = new URL(`http://localhost:8000/analyse_answers`);
        url.searchParams.append('assessment_id', assessmentId);

        const response = await fetch(url, { method: 'POST' });
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