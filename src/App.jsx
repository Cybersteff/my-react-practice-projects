import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import indexedDB from "indexedDB";
import "./index.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [bd, setDb] = useState(null);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const db = await indexedDB.createDatabase("TodoDB");
      setDb(db);
      const conn = await db.open();
      const store = conn.createObjectStore("Todo", {
        keyPath: "id",
        autoIncrement: true,
      });
      setStore(store);
      store.createIndex("title", "title", { unique: false });
      const todos = await store.getAll();
      setTodos(await todos.json());
    };
    initDB;
  }, []);

  const handleSubmit = (event) => {
    const submitHandler = async () => {
      event.preventDefault();
      if (store && db) {
        const newTodoObj = { id: Date.now(), title: newTodo, completed: false };
        store.put(newTodoObj);
        setTodos([...todos, newTodoObj]);
        setNewTodo("");
      }
    };
    submitHandler;
  };

  const handleToggelCompleted = (id) => {
    const completedTaskHandler = async () => {
      if (store && db) {
        const todo = await store.get(id);
        todo.completed = !todo.completed;
        store.put(todo);
        setTodos(todos.map((todo) => (todo.id === id ? todo : todo)));
      }
    };
    completedTaskHandler;
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          placeholder="Enter new todo item"
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => handleToggelCompleted(todo.id)}>
              {todo.completed ? "Undo" : "Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
