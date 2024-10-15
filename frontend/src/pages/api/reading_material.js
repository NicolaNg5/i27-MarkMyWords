// pages/api/reading_material.js
export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const response = await fetch('http://localhost:8000/reading_material'); 
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching reading material:", error);
        res.status(500).json({ error: "Failed to fetch reading material" });
      }
    } else {
      res.status(405).end();
    }
  }