import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TodoItem from "../components/TodoItem";
import { api } from "../utils/baseUrl";

const Home = ({ todo_list }) => {
  const [todos, setTodos] = useState([]);
  const inputRef = useRef(null);
  const [newTodo, setNewTodo] = useState("");
  // const [editedTodo, setEditedTodo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [matchResult, setMatchResult] = useState([]);
  const [startTyping, setStartTyping] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [completedList, setCompletedList] = useState([]);
  // const [inCompletedList, setInCompletedList] = useState([]);

  // console.log(todos);

  // console.log(newTodo !== "" && matchResult.length > 0);
  useEffect(() => {
    // const getTodo = async () => {
    //   const { data } = await api.get("/todo_list.json");
    //   let todo_list = [];
    //   if (data) {
    //     //convert returned object from firebase to array
    //     for (const key in data) {
    //       todo_list.push({
    //         id: key,
    //         todo: data[key].todo,
    //         isCompleted: data[key].isCompleted,
    //         createdAt: data[key].createdAt,
    //       });
    //     }
    //   }
    //   setTodos(todo_list);
    // };
    // getTodo();
    setTodos(todo_list);
    // setCompletedList(
    //   todo_list.filter((todo) => {
    //     return todo.isCompleted;
    //   })
    // );
    // setInCompletedList(
    //   todo_list.filter((todo) => {
    //     return !todo.isCompleted;
    //   })
    // );
  }, [todo_list]);

  // console.log("completed list", completedList);
  // console.log("incompleted list", inCompletedList);

  const inputHandler = (e) => {
    let input = e.target.value;
    setNewTodo(input);
    // console.log(input.length, input);
    if (input === "") {
      // console.log("true");
      setIsEdit(false);
      setConfirmEdit(false);
      setErrorMessage("");
      setMatchResult([]);
      return;
    }
    if (!isEdit) {
      let match = [];
      todos.forEach((i) => {
        // i.todo.slice(0, input.length) === input
        //   ? console.log(i.todo)
        //   : // setMatchResult((prev) => [...prev, i.todo])
        //     console.log("no match");
        // setMatchResult([]);
        if (
          i.todo.slice(0, input.length).trim() === input.toLowerCase().trim()
        ) {
          match.push(i.todo);
          // console.log(match);
        }
        // console.log(match);
        setMatchResult(match);
        // console.log(i.todo.slice(0, input.length));
      });
    }
  };

  const addTodoHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (newTodo.trim() === "") {
      return;
    }

    if (checkIfListExist(newTodo)) {
      return;
    }
    // console.log("asd");
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000) * 1000;
    const newTodoObject = {
      // id: crypto.randomUUID(),
      todo: newTodo,
      isCompleted: false,
      createdAt: timestamp,
    };
    try {
      setIsLoading(true);
      await axios.post("/api/new-todo", newTodoObject);
      const { data } = await api.get("/todo_list.json");
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
      }
      setTodos(todo_list);
      setNewTodo("");
      setIsLoading(false);
    } catch (err) {
      // console.log(err.response);
    }
  };

  const removeHandler = async () => {
    setErrorMessage("");
    if (todos.length === 1) {
      setErrorMessage(
        "List should not be empty! Either add a new task or complete the existing one."
      );
      return;
    }
    try {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
      const res = await axios.post("/api/remove-todo", { id: todoId });
      // console.log(res);
      setConfirmRemove(false);
    } catch (err) {
      // console.log(err);
      // console.log("after delete");
      setTimeout(() => {
        setTodos(todo_list);
        setErrorMessage("Failed to remove! Try reload the page");
        setConfirmRemove(false);
      }, 2000);
    }
  };

  // const toggleComplete = async (id) => {
  //   const updatedTodos = todos.map((todo) =>
  //     todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
  //   );
  //   // await axios.put(
  //   //   `/api/todo/${id}`,
  //   //   updatedTodos.find((todo) => todo.id === id)
  //   // );
  //   setTodos(updatedTodos);
  // };
  const markAsComplete = async (id) => {
    setErrorMessage("");
    try {
      const updatedTodo = todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      );
      setTodos(updatedTodo);
      await axios.post("/api/update-todo", {
        id,
        updatedTodo: updatedTodo.find((todo) => todo.id === id),
      });
    } catch (err) {
      // console.log(err);
      setTimeout(() => {
        setTodos(todo_list);
        setErrorMessage("Failed to update! Try reload the page");
      }, 2000);
    }
  };
  const markAsInomplete = async (id) => {
    setErrorMessage("");
    try {
      const updatedTodo = todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: false } : todo
      );
      setTodos(updatedTodo);
      await axios.post("/api/update-todo", {
        id,
        updatedTodo: updatedTodo.find((todo) => todo.id === id),
      });
    } catch (err) {
      // console.log(err);
      setTimeout(() => {
        setTodos(todo_list);
        setErrorMessage("Failed to update! Try reload the page");
      }, 2000);
    }
  };

  //update todo
  const getTodoFromList = (todo) => {
    if (todo.edit) {
      setIsEdit(true);
      setNewTodo(todo?.todo);
      inputRef?.current.focus();
    }
    if (todo.remove) {
      setConfirmRemove(true);
    }
    setTodoId(todo.id);
    // console.log(todo.id);
  };

  const editHandler = async (e) => {
    // console.log("submit");
    setErrorMessage("");
    setConfirmEdit(true);
    console.log(newTodo);
    try {
      if (checkIfListExist(newTodo)) {
        return;
      }

      const updatedTodo = todos.map((todo) =>
        todo.id === todoId ? { ...todo, todo: newTodo } : todo
      );

      setTodos(updatedTodo);
      const res = await axios.post("/api/update-todo", {
        id: todoId,
        updatedTodo: updatedTodo.find((todo) => todo.id === todoId),
      });
      // console.log(res);
      if (res.status === 200) {
        setIsEdit(false);
        setNewTodo("");
        setConfirmEdit(false);
        setTodoId(null);
      }
    } catch (err) {
      setTimeout(() => {
        setTodos(todo_list);
        setIsEdit(false);
        setErrorMessage("Failed to update! Try reload the page");
        setNewTodo("");
        setConfirmEdit(false);
        setTodoId(null);
      }, 2000);
    }
  };

  const checkIfListExist = (newTodo) => {
    for (const i of todos) {
      if (i.todo.trim() === newTodo) {
        // console.log("true");
        setErrorMessage("This task already existed in the list");
        return true;
      }
    }
  };
  return (
    <main>
      <h1>Todo List</h1>

      <form onSubmit={isEdit ? undefined : addTodoHandler}>
        <input
          onFocus={() => {
            setStartTyping(true);
          }}
          onBlur={() => {
            setStartTyping(false);
            // setIsEdit(false);
            // setMatchResult([]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isEdit) setConfirmEdit(true);
          }}
          ref={inputRef}
          type="text"
          value={newTodo}
          required
          onChange={inputHandler}
          // style={{ width: "full" }}
        />
        <button disabled={isEdit} type="submit">
          Add Todo
        </button>
      </form>

      {isLoading && <h2>Adding a new task...</h2>}
      {/* confirmEdit */}
      {confirmEdit && (
        <div>
          <button
            onClick={() => {
              setConfirmEdit(false);
              setNewTodo("");
              setTodoId(null);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              editHandler();
            }}
          >
            Confirm edit
          </button>
        </div>
      )}

      {/* Confirm remove  */}
      {confirmRemove && (
        <div>
          <button
            onClick={() => {
              setConfirmRemove(false);
              setTodoId(null);
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              removeHandler();
            }}
          >
            Confirm remove
          </button>
        </div>
      )}

      {/* Search result  */}
      {newTodo !== "" && matchResult.length > 0 ? (
        <div>
          <h2>Match result</h2>
          {matchResult.map((result, index) => (
            <h2 key={index}>{result}</h2>
          ))}
        </div>
      ) : (
        newTodo !== "" &&
        startTyping &&
        !isEdit &&
        !isLoading && <h2>No result. Create a new one instead!</h2>
      )}

      {/* error message  */}
      {errorMessage !== "" && <h3>{errorMessage}</h3>}

      {/* render the list  */}
      <ul>
        {todos
          .sort(function (a, b) {
            if (a.todo < b.todo) {
              return -1;
            }
            if (a.todo > b.todo) {
              return 1;
            }
            return 0;
          })
          .filter((todo) => !todo.isCompleted)
          .map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              todo={todo.todo}
              isCompleted={todo.isCompleted}
              onRemove={getTodoFromList}
              onMarkAsComplete={markAsComplete}
              onMarkAsIncomplete={markAsInomplete}
              onEdit={getTodoFromList}
            />
          ))}
        {todos
          .sort(function (a, b) {
            if (a.todo < b.todo) {
              return -1;
            }
            if (a.todo > b.todo) {
              return 1;
            }
            return 0;
          })
          .filter((todo) => todo.isCompleted)
          .map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              todo={todo.todo}
              isCompleted={todo.isCompleted}
              onRemove={getTodoFromList}
              onMarkAsComplete={markAsComplete}
              onMarkAsIncomplete={markAsInomplete}
              onEdit={getTodoFromList}
            />
          ))}
        {/* {todos
          .sort(function (a, b) {
            if (a.todo < b.todo) {
              return -1;
            }
            if (a.todo > b.todo) {
              return 1;
            }
            return 0;
          })
          .filter()} */}
        {/* {inCompletedList
          .sort(function (a, b) {
            if (a.todo < b.todo) {
              return -1;
            }
            if (a.todo > b.todo) {
              return 1;
            }
            return 0;
          })
          .map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              todo={todo.todo}
              isCompleted={todo.isCompleted}
              onRemove={getTodoFromList}
              onMarkAsComplete={markAsComplete}
              onMarkAsIncomplete={markAsInomplete}
              onEdit={getTodoFromList}
              doneEdit={isEdit}
            />
          ))}
        {completedList
          .sort(function (a, b) {
            if (a.todo < b.todo) {
              return -1;
            }
            if (a.todo > b.todo) {
              return 1;
            }
            return 0;
          })
          .map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              todo={todo.todo}
              isCompleted={todo.isCompleted}
              onRemove={getTodoFromList}
              onMarkAsComplete={markAsComplete}
              onMarkAsIncomplete={markAsInomplete}
              onEdit={getTodoFromList}
            />
          ))} */}
      </ul>
    </main>
  );
};

export default Home;

/*It will be no content in the page
if useEffect was used to fetch the data due to its render cycle.
And that's bad for SEO which is the main purpose of building with Nextjs
Tho its just a todo list app but still a good practice

-Not using SSR (getServerSideProps) bcuz there no incoming req (auth)
that cause the site to preload from the server so SSG would be a better option*/
export async function getStaticProps() {
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
    }
    return {
      props: {
        todo_list,
      },
      revalidate: 1, // In seconds
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
}
