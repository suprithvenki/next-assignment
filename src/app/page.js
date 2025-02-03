"use client";

import { useEffect, useState } from "react";
import "./style.css";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingTask ? "PUT" : "POST";
    const body = JSON.stringify({
      id: editingTask?._id,
      title,
      description,
      dueDate,
      completed: editingTask?.completed,
    });

    await fetch("/api/tasks", {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingTask(null);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate.split("T")[0]);
    setEditingTask(task);
  };

  const handleDelete = async (id) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
  };

  const toggleCompletion = async (task) => {
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: !task.completed,
      }),
    });
    fetchTasks();
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
            <button onClick={() => toggleCompletion(task)}>
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
