import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("high");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("high");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          placeholder="Enter Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          className="form-control"
          id="description"
          value={description}
          placeholder="Enter Description"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          className="form-control"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Add Task
      </button>
    </form>
  );
};

const TaskList = ({ tasks, onDelete }) => (
  <div>
    {tasks.length === 0 ? (
      <p>No tasks available.</p>
    ) : (
      tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          <h5>{task.title}</h5>
          <p>{task.description}</p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      ))
    )}
  </div>
);

const AddTask = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      axios
        .get("https://jsonplaceholder.typicode.com/posts?_limit=5")
        .then((res) => {
          const apiTasks = res.data.map((task, index) => ({
            id: index + 1,
            title: task.title,
            description: task.body,
            priority: ["high", "medium", "low"][index % 3],
          }));
          setTasks(apiTasks);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...task, id: prevTasks.length + 1 },
    ]);
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Title,Description,Priority"]
        .concat(
          tasks.map(
            (t) => `${t.id},${t.title},${t.description},${t.priority}`
          )
        )
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "tasks.csv";
    link.click();
  };

  const uploadCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const rows = csv.split("\n").slice(1);
      const newTasks = rows
        .filter((row) => row.trim() !== "")
        .map((row, index) => {
          const [id, title, description, priority] = row.split(",");
          return {
            id: tasks.length + index + 1,
            title: title.trim(),
            description: description.trim(),
            priority: priority.trim(),
          };
        });
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <TaskForm onSubmit={addTask} />
      <div style={{ marginTop: "20px" }}>
        <input type="file" accept=".csv" onChange={uploadCSV} />
        <button className="btn btn-secondary" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>
      <h3 style={{ marginTop: "20px" }}>Task List</h3>
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </div>
  );
};

export default AddTask;
