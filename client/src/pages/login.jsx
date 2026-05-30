import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: form.email.toLowerCase().trim(),
          password: form.password
        }
      );

      if (!res.data || !res.data.token) {
        setMessage("Token not received from server ❌");
        setIsSuccess(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.userId);

      setMessage("Login Successful ✅");
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data || "Invalid Credentials ❌");
      setIsSuccess(false);
    }
  };

  const sendOTP = async () => {
    if (!form.email) {
      setMessage("Enter email first");
      setIsSuccess(false);
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: form.email.toLowerCase().trim()
      });
      setMessage("OTP Sent Successfully ");
      setIsSuccess(true);
      setShowReset(true);
    } catch (err) {
      setMessage(err.response?.data || "Error ");
      setIsSuccess(false);
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email: form.email.toLowerCase().trim(),
        otp: otp,
        newPassword: newPassword
      });
      setMessage("Password Reset Successful ");
      setIsSuccess(true);
      setShowReset(false);
    } catch (err) {
      setMessage(err.response?.data || "Invalid OTP ");
      setIsSuccess(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* CSS Injection to turn the default browser eye icon WHITE */}
      <style>
        {`
          input::-ms-reveal,
          input::-webkit-contacts-auto-fill-button,
          input::-webkit-credentials-auto-fill-button {
            filter: invert(100%);
          }
        `}
      </style>

      <div style={styles.overlay}>
        <div style={styles.brandSection}>
          <h1 style={styles.brandTitle}>Lost & Found</h1>
          <p style={styles.brandTagline}>
            Secure platform to report and claim lost items.
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Sign In</h2>

          {message && (
            <div
              style={{
                ...styles.messageBox,
                background: isSuccess ? "#dcfce7" : "#fee2e2",
                color: isSuccess ? "#166534" : "#991b1b"
              }}
            >
              {message}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.passwordWrapper}>
            <input
              type="password" // Browser handle karega default eye ko
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <p style={styles.forgot} onClick={sendOTP}>
            Forgot Password?
          </p>

          <button onClick={handleSubmit} style={styles.button}>
            Login
          </button>

          {showReset && (
            <div style={styles.resetBox}>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
              <button onClick={resetPassword} style={styles.button}>
                Reset Password
              </button>
            </div>
          )}

          <p style={styles.linkText}>
            Don’t have an account?{" "}
            <span style={styles.link} onClick={() => navigate("/register")}>
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: {
    width: "100%",
    height: "100%",
    background: "rgba(15,23,42,0.85)", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "60px"
  },
  brandSection: {
    color: "white",
    maxWidth: "350px"
  },
  brandTitle: {
    fontSize: "42px",
    fontWeight: "bold"
  },
  brandTagline: {
    marginTop: "10px",
    color: "#94a3b8"
  },
  card: {
    width: "350px",
    padding: "30px",
    borderRadius: "14px",
    background: "#1e293b",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },
  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "12px"
  },
  forgot: {
    textAlign: "right",
    fontSize: "13px",
    color: "#3b82f6",
    cursor: "pointer",
    marginBottom: "10px"
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  linkText: {
    marginTop: "15px",
    textAlign: "center",
    color: "#cbd5f5"
  },
  link: {
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: "bold"
  },
  messageBox: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontWeight: "bold",
    textAlign: "center"
  },
  resetBox: {
    marginTop: "10px"
  }
};

export default Login;