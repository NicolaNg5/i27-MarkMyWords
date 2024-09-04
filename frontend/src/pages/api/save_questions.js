export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        const data = JSON.parse(req.body); 
        const questions = data.questions; 
  
        if (!questions || !Array.isArray(questions)) {
          return res.status(400).json({ error: "Invalid questions data" });
        }
  
        console.log("Received questions:", questions);
  
        res.status(200).json({ message: "Questions saved successfully!" });
      } catch (error) {
        console.error("Error saving questions:", error);
        res.status(500).json({ error: "Failed to save questions" });
      }
    } else {
      res.status(405).end();
    }
  }