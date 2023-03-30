import React, { useState } from "react";

const TodoItem = ({
  id,
  todo,
  isCompleted,
  onRemove,
  onMarkAsComplete,
  onMarkAsIncomplete,
  onEdit,
}) => {
  const [isHovering, setIsHovering] = useState(false);

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
    const updatedTodo = { id, todo, edit: true };
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
      <h3>
        {todo} ({isCompleted ? "completed" : "not completed"})
      </h3>
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
