import axios from "axios";

export const api = axios.create({
  baseURL:
    "https://todo-list-ed8da-default-rtdb.asia-southeast1.firebasedatabase.app",
});
