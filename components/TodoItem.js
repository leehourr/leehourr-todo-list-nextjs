import React, { useEffect, useState } from "react";

const TodoItem = ({
  id,
  todo,
  isCompleted,
  onRemove,
  onMarkAsComplete,
  onMarkAsIncomplete,
  onEdit,
  doneEdit,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  useEffect(() => {
    if (!doneEdit) {
      setIsEdit(false);
    }
  }, [doneEdit]);
  const removeTodoHandler = () => {
    // console.log(id);
    const updatedTodo = { id, remove: true };
    onRemove(updatedTodo);
  };

  const markAsComplete = () => {
    onMarkAsComplete(id);
  };

  const markAsIncomplete = () => {
    onMarkAsIncomplete(id);
  };

  const updateHandler = () => {
    onUpdate(id);
  };

  const editHandler = () => {
    if (isCompleted) {
      setIsTaskCompleted(true);
      return;
    }
    const updatedTodo = { id, todo, edit: true };
    setIsEdit(true);
    console.log(id, "is being edited");
    onEdit(updatedTodo);
  };
  return (
    <li
      onMouseOver={() => {
        setIsHovering(true);
      }}
      onMouseOut={() => {
        setIsHovering(false);
      }}
      style={{ cursor: "pointer", width: "fit-content" }}
      key={id}
    >
      {/* style={` "text-decoration":"line-through"}`} */}
      <h3
        style={{
          textDecoration: isCompleted ? "line-through" : "none",
        }}
      >
        {todo} ({isCompleted ? "completed" : "not completed"})
      </h3>
      {isEdit && <span>Is being edited.</span>}
      {isTaskCompleted && <span>You can not edit the completed task!</span>}
      {isHovering && (
        <div>
          <button onClick={markAsComplete.bind(null, id)}>
            Mark as Complete
          </button>
          <button onClick={markAsIncomplete.bind(null, id)}>
            Mark as Incomplete
          </button>
          <div>
            <button onClick={editHandler.bind(null, id, todo)}>Edit</button>
            <button onClick={removeTodoHandler.bind(null, id)}>Remove</button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
