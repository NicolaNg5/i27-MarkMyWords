export default async function handler(req, res) {
    const { assessmentid } = req.query;
    if (req.method === "GET") {
      try {
        const response = await fetch(
          `http://localhost:8000/question/assessment/${assessmentid}`
        );
        const data = await response.json(); //parse json string to js object to be used below
        res.status(200).json(data); //parse back to json string to transmit to front end, front end parse to js obj to be used
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch questions" });
      }
    } else {
      res.status(405).end();
    }
  }