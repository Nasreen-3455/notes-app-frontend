import { useState } from "react";
import axios from "axios";
import "./index.css";

const BASE_URL = "https://notes-app-backend-9u9b.onrender.com";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // LOGIN
  const loginUser = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login Successful 🚀");
    } catch (err) {
      alert("Login Failed ❌");
    }
  };

  // GET NOTES
  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/api/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes(res.data);
    } catch (err) {
      alert("Failed to fetch notes");
    }
  };

  // CREATE OR UPDATE NOTE
  const saveNote = async () => {
    try {
      const token = localStorage.getItem("token");

      if (editingId) {
        // UPDATE
        await axios.put(
          `${BASE_URL}/api/notes/${editingId}`,
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // CREATE
        await axios.post(
          `${BASE_URL}/api/notes`,
          { title, content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      getNotes();
    } catch (err) {
      alert("Failed to save note");
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${BASE_URL}/api/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getNotes();
    } catch (err) {
      alert("Failed to delete note");
    }
  };

  // SET EDIT MODE
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  return (
    <div className="app-container">

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="card">
          <h2 style={{ marginBottom: "20px" }}>Welcome Back 👋</h2>

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" onClick={loginUser}>
            Login
          </button>

          <button className="button" onClick={getNotes}>
            Load Notes
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          Your Notes ✨
        </h2>

        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="button" onClick={saveNote}>
          {editingId ? "Update Note" : "Create Note"}
        </button>

        {notes.map((note) => (
          <div key={note._id} className="note-card">
            <h4>{note.title}</h4>
            <p>{note.content}</p>

            <div style={{ marginTop: "10px" }}>
              <button
                className="button"
                style={{ marginRight: "5px" }}
                onClick={() => editNote(note)}
              >
                Edit
              </button>

              <button
                className="button"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;