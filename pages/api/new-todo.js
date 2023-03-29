import { api } from "../../utils/baseUrl";

export default async function handler(req, res) {
  try {
    const data = req.body;
    const result = await api.post("/todo_list.json", data);
    console.log(result.data);
    if (result) {
      //Had me stuck for like an hour to figure out "return" and include result is unnecessary in nextjs :D
      res.json({ message: "New list added successfully" });
    }
    res.send({ message: "New list failed to add" });
  } catch (error) {
    console.log(error.response);
    res.status(500).send({
      message: "Failed to add a new list! Try reload the page.",
    });
  }
}
