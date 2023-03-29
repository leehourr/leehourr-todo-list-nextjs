import { api } from "./baseUrl";

export const getTodo = async () => {
  try {
    const { data } = await api.get("/todo_list.json");

    //check if there're data being returned otherwise "data not found"
    let todo_list = [];
    if (data) {
      //convert returned object from firebase to array
      for (const key in data) {
        todo_list.push({
          id: key,
          todo: data[key].todo,
          isCompleted: data[key].isCompleted,
          createdAt: data[key].createdAt,
        });
      }
      res.status(200).json({ status: "ok", data: todo_list });
    }
    res.status(404).json({ message: "data not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
