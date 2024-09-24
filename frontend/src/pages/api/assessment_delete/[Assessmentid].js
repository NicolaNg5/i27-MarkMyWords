export default async function handler(req, res) {
  const { Assessmentid } = req.query;
  if (req.method === "DELETE") {
    try {
      const url = new URL(
        `https://i27-markmywords.vercel.app/delete_assessment`
      );
      url.searchParams.append("assessment_id", Assessmentid);

      const response = await fetch(url, { method: "DELETE" });
      const data = await response.json(); //parse json string to js object to be used below
      res.status(200).json(data); //parse back to json string to transmit to front end, front end parse to js obj to be used
    } catch (error) {
      res.status(500).json({ error: "Failed to delete assessments" });
    }
  } else {
    res.status(405).end();
  }
}
