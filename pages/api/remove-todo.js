import { api } from './baseUrl';

export default async function handler(req, res) {
  console.log(req.body);

  try {
    const { id } = req.body;
    console.log(id);
    await api.delete(`/todo_list/${id}.json`);
    res.status(200).json({ message: 'List successfully removed', id });
  } catch (error) {
    console.log(error.response);
    res.status(500).send({ message: 'Failed to remove! Try reload the page' });
  }
}
