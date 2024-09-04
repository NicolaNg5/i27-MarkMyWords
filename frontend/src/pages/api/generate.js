export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        body: req.body
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate response' });
    }
  } else {
    res.status(405).end();
  }
}