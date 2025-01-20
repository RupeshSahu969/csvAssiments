import axios from "axios";
import React, { useEffect, useState } from "react";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("high");
  const [task, setTask] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Corrected typo from "defualt" to "default"
    console.log({ title, description, priority }); // Add your logic here
    // Clear form fields after submission
    const payload = {
      id: task.length + 1,
      title,
      description,
      priority,
    };
    const updatetask = [...task, payload];
    setTask(updatetask);
    localStorage.setItem("task", JSON.stringify(updatetask));
    axios
      .post("https://jsonplaceholder.typicode.com/posts?_limit=5", payload)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setTitle("");
    setDescription("");
    setPriority("high");
  };

  useEffect(() => {
    const storeTask = localStorage.getItem("task");
    if (storeTask) {
      setTask(JSON.parse(storeTask));
    } else {
      axios
        .get("https://jsonplaceholder.typicode.com/posts?_limit=5")
        .then((res) => {
          const apiTask = res.data.map((task, index) => ({
            id: index + 1,
            title: task.title,
            description: task.body,
            priority: ["high", "medium", "low"][index % 3],
          }));
          setTask(apiTask);
        })
        .catch((err) => console.log(err));
    }
  });

  const DeleteFrom = (id) => {
    const DeleteData = task.filter((t) => t.id !== id);
    setTask(DeleteData);
    localStorage.setItem("task", JSON.stringify(DeleteData));
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts?_limit=5/${id}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };
  const dowloadingCSV = () => {
    const csvConst =
      "data:text/csv;charset=utf-8, " +
      ["ID,Title, Description,Priority"]
        .concat(
          task.map((t) => `${t.id},${t.title},${t.description},${t.priority}`)
        )
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvConst);
    link.download = "teaks.csv";
    link.click();
  };

  const uploadCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const rows = csv.split("/n").slice(1);
      const newTask = rows
        .filter((row) => row.trim() !== "")
        .map((row, index) => {
          const [id, title, description, priority] = row.split(",");

          return {
            id: task.length + index + 1,
            title: title.trim(),
            description: description.trim(),
            priority: priority.trim(),
          };
        });
      const updateTask = [...task, ...newTask];
      setTask(updateTask);
      localStorage.setItem("task", JSON.stringify(updateTask));
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div>
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
          <input type="submit" value="Submit" className="btn btn-primary" />
        </form>
      </div>
      <div>
        <div>
          <h1>Upload and Download</h1>
          <div style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept=".csv"
          onChange={uploadCSV}
          style={{ marginBottom: "10px" }}
        />
        </div>
          <button className="btn btn-secondary" onClick={dowloadingCSV}>
            Download CSV
          </button>
        </div>

        <h1>Show all task</h1>
        {task.map((item, index) => (
          <div key={item.index}>
            {" "}
            {item.title}
            {item.description}
            {item.priority}
            <buttion
              className="btn btn-danger"
              style={{ marginLeft: 20 }}
              onClick={(id) => DeleteFrom(item.id)}
            >
              Delete
            </buttion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTask;
