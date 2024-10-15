export default async function handler(req, res) {

    const { assessment_id, title, topic, due_Date } = req.body;
      if (req.method === "PUT") {
        try {
          const url = new URL("http://localhost:8000/update_assessment");
          url.searchParams.append("assessment_id", assessment_id);

          title ? url.searchParams.append("title", title): undefined;
          topic ? url.searchParams.append("topic", topic): undefined;
          due_Date ? url.searchParams.append("due_Date", due_Date): undefined;
          console.log(url.search);
  
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          const data = await response.json();
    
          if (response.ok) {
            res.status(201).json(data);
          } else {
            res.status(response.status).json(data);
          }
        } catch (error) {
          res
            .status(500)
            .json({ detail: "An error occurred while updating assessment:" + error });
        }
      } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
    