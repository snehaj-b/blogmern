import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://(localhost):5004/api";

const styles = {
  header: {
    background: "#1a1a2e",
    color: "#e8d5b7",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: { maxWidth: 900, margin: "0 auto", padding: "30px 20px" },
  btn: {
    background: "#e8d5b7",
    color: "#1a1a2e",
    border: "none",
    padding: "8px 18px",
    borderRadius: 4,
    fontWeight: "bold",
    cursor: "pointer",
  },
  btnDanger: {
    background: "#c0392b",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
  },
  btnEdit: {
    background: "#2980b9",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    marginRight: 6,
  },
  card: {
    background: "#fff",
    border: "1px solid #e0ddd6",
    borderRadius: 8,
    padding: "24px",
    marginBottom: 20,
  },
  form: {
    background: "#fff",
    border: "1px solid #e0ddd6",
    borderRadius: 8,
    padding: 24,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 15,
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 15,
    minHeight: 100,
    resize: "vertical",
  },
  tag: {
    display: "inline-block",
    background: "#e8d5b7",
    color: "#1a1a2e",
    padding: "2px 10px",
    borderRadius: 12,
    fontSize: 12,
    marginBottom: 8,
  },
  meta: { color: "#888", fontSize: 13, marginBottom: 8 },
};

const empty = { title: "", content: "", author: "", category: "General" };

export default function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`);
      setPosts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/posts/${editId}`, form);
      } else {
        await axios.post(`${API}/posts`, form);
      }
      setForm(empty);
      setEditId(null);
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      alert("Error saving post");
    }
    setLoading(false);
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, content: post.content, author: post.author, category: post.category });
    setEditId(post._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await axios.delete(`${API}/posts/${id}`);
    fetchPosts();
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ fontSize: 26, letterSpacing: 1 }}>📝 My Blog</h1>
        <button style={styles.btn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
          {showForm ? "Cancel" : "+ New Post"}
        </button>
      </div>

      <div style={styles.container}>
        {showForm && (
          <form style={styles.form} onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: 16 }}>{editId ? "Edit Post" : "New Post"}</h2>
            <input style={styles.input} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input style={styles.input} placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
            <input style={styles.input} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <textarea style={styles.textarea} placeholder="Write your post content..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? "Saving..." : editId ? "Update Post" : "Publish Post"}
            </button>
          </form>
        )}

        <h2 style={{ marginBottom: 20, color: "#1a1a2e" }}>All Posts ({posts.length})</h2>

        {posts.length === 0 && <p style={{ color: "#888" }}>No posts yet. Create your first post!</p>}

        {posts.map(post => (
          <div key={post._id} style={styles.card}>
            <span style={styles.tag}>{post.category}</span>
            <h2 style={{ fontSize: 22, marginBottom: 6 }}>{post.title}</h2>
            <p style={styles.meta}>By {post.author} · {new Date(post.createdAt).toLocaleDateString()}</p>
            <p style={{ marginBottom: 16, lineHeight: 1.7 }}>{post.content}</p>
            <button style={styles.btnEdit} onClick={() => handleEdit(post)}>Edit</button>
            <button style={styles.btnDanger} onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
