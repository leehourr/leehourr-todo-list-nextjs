import { api } from "../../utils/baseUrl";

export default async function handler(req, res) {
  try {
    const data = req.body;
    const newTodo = await api.post("/todo_list.json", data);
    // console.log(result.data);

    //Had me stuck for like an hour to figure out "return" and include result is unnecessary in nextjs :D
    res.status(200).json({ message: "New list added successfully" });
  } catch (error) {
    console.log(error.response);
  }
}
