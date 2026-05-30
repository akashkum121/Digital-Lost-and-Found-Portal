import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",   
    mobile: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "mobile") {
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setForm({ ...form, mobile: numericValue });
      }
      return;
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          ...form,
          email: form.email.toLowerCase().trim() 
        }
      );

      setMessage("Registered Successfully ");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      setMessage(
        err.response?.data || "Registration Failed "
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>

        <div style={styles.brand}>
          <h1 style={styles.brandTitle}>Lost & Found</h1>
          <p style={styles.brandSub}>
            Create your account to securely report and recover lost items.
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Create Your Account</h2>

          {message && (
            <p style={{
              ...styles.message,
              color: message.includes("Successfully") ? "#22c55e" : "#ef4444"
            }}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number (10 digits)"
              value={form.mobile}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ ...styles.input, paddingRight: "40px" }}
              />

              <span
                style={styles.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" style={styles.button}>
              Register
            </button>

          </form>

          <p style={styles.linkText}>
            Already have an account?{" "}
            <Link to="/" style={styles.link}>
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')", // 🔥 NEW IMAGE
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  overlay: {
    width: "100%",
    height: "100%",
    background: "rgba(15,23,42,0.85)", // 🔥 DARK BLUE OVERLAY
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "80px",
    padding: "0 60px"
  },

  brand: {
    color: "white",
    maxWidth: "400px"
  },

  brandTitle: {
    fontSize: "42px",
    marginBottom: "20px"
  },

  brandSub: {
    fontSize: "18px",
    opacity: "0.9"
  },

  card: {
    width: "400px",
    padding: "40px",
    borderRadius: "15px",
    background: "white",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
  },

  title: {
    marginBottom: "20px",
    textAlign: "center"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box"
  },

  passwordWrapper: {
    position: "relative",
    width: "100%"
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(90deg,#16a34a,#22c55e)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  message: {
    marginBottom: "15px",
    fontWeight: "bold",
    textAlign: "center"
  },

  linkText: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px"
  },

  link: {
    color: "#2563eb",
    fontWeight: "bold"
  }
};

export default Register;