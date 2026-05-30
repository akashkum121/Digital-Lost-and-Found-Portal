import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email: form.email }
      );
      setMessage("OTP Sent (Check Server Console)");
      setStep(2);
    } catch (err) {
      setMessage("User not found ");
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        form
      );
      setMessage("Password Reset Successful ");
      setStep(1);
    } catch (err) {
      setMessage("Invalid or Expired OTP ");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Reset Password</h2>

        {message && (
          <div style={styles.message}>{message}</div>
        )}

        {step === 1 && (
          <>
            <input
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              style={styles.input}
            />
            <button onClick={sendOTP} style={styles.button}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              name="otp"
              placeholder="Enter OTP"
              onChange={handleChange}
              style={styles.input}
            />
            <input
              name="newPassword"
              placeholder="New Password"
              type="password"
              onChange={handleChange}
              style={styles.input}
            />
            <button onClick={resetPassword} style={styles.button}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#0f172a",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  message: {
    marginBottom: "10px",
    fontWeight: "bold"
  }
};

export default ForgotPassword;