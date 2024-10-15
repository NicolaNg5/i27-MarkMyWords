export default async function handler(req, res) {
    const { classId } = req.query;
    if (req.method === "GET") {
      try {
        const url = new URL(`http://localhost:8000/class/students`);
        url.searchParams.append('class_id', classId);
        
        const response = await fetch(url);
        const data = await response.json(); //parse json string to js object to be used below
        res.status(200).json(data); //parse back to json string to transmit to front end, front end parse to js obj to be used
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch students in class " + classId });
      }
    } else {
      res.status(405).end();
    }
  }