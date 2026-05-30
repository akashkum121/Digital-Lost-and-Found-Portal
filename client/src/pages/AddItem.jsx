import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    contact: "",
    status: "Lost",
    lostDate: ""
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.title || !form.description || !form.location || !form.contact || !form.lostDate) {
      return setError("All fields are required");
    }

    if (form.contact.length !== 10) {
      return setError("Contact must be 10 digits");
    }

    const today = new Date().toISOString().split("T")[0];
    if (form.lostDate > today) {
      return setError("Future date not allowed");
    }

    if (images.length === 0) {
      return setError("Please select at least one image");
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(
        "http://localhost:5000/api/items/add",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      setMessage("Item added successfully ✅");
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err) {
      setError(err.response?.data || "Error adding item");
    }
  };

  return (
    <div style={styles.page}>
      {/* 
          FORCE CALENDAR ICON: 
          Ye CSS browser ko force karta hai calendar icon dikhane ke liye 
          jaisa Screenshot 2026-05-04 205248.png mein dikh raha hai.
      */}
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: block !important;
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 10px;
            top: 0;
            width: auto;
            opacity: 1;
            filter: invert(0.5); /* Icon ko thoda dark karne ke liye */
          }
          .date-input-container {
            position: relative;
            display: flex;
            flex-direction: column;
          }
        `}
      </style>

      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.heading}>Report a Lost or Found Item</h2>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <input
          name="title"
          placeholder="Item Title"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="contact"
          placeholder="Contact (10 digits)"
          value={form.contact}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          style={{ ...styles.input, minHeight: "80px" }}
        />

        <select
          name="status"
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Lost">I Lost an Item (Need to Find)</option>
          <option value="Found">I Found an Item (Need to Return)</option>
        </select>

        {/* Container added to ensure the icon stays inside the input box */}
        <div className="date-input-container">
          <input
            type="date"
            name="lostDate"
            value={form.lostDate}
            onChange={handleChange}
            max="9999-12-31" 
            required
            style={styles.input}
          />
        </div>

        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  card: {
    background: "#f8fafc",
    padding: "35px",
    borderRadius: "14px",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    fontFamily: "'Times New Roman', serif"
  },
  heading: {
    textAlign: "center",
    color: "#1e293b",
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "8px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#334155",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'Times New Roman', serif",
    width: "100%",
    boxSizing: "border-box"
  },
  button: {
    padding: "12px",
    background: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "'Times New Roman', serif",
    transition: "0.3s"
  },
  error: { color: "#ef4444", fontSize: "13px", textAlign: "center" },
  success: { color: "#22c55e", fontSize: "13px", textAlign: "center" }
};

export default AddItem;