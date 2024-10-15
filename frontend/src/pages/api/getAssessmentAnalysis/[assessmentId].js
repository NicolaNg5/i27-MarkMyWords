export default async function handler(req, res) {
    const { assessmentId } = req.query;
    if (req.method === 'GET') {
        try {
            const url = new URL(`http://localhost:8000/analysis/${assessmentId}`);
            const response = await fetch(url, { method: 'GET' });
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch analysis" });
        }
    } else {
        res.status(405).end();
    }
}