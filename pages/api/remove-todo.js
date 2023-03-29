import { api } from "../../utils/baseUrl";

export default async function handler(req, res) {
  // console.log(req.body);

  try {
    const { id } = req.body;
    // console.log(id);
    const result = await api.delete(`/todo_list/${id}.json`);
    console.log(result.data);
    res.status(200).json({ message: "List successfully removed" });
  } catch (error) {
    // console.log(error);
    console.log(error.response);
  }
}
