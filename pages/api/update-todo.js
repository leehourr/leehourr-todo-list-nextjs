import { api } from "./baseUrl";

export default async function handler(req, res) {
  try {
    const { id, updatedTodo } = req.body;
    console.log(id, updatedTodo);
    await api.put(`/todo_list/${id}.json`, updatedTodo);
    res.status(200).json({ message: "List successfully updated" });
  } catch (error) {
    console.log(error.response);
    res.status(500).send({ message: "Failed to update! Try reload the page" });
  }
}
