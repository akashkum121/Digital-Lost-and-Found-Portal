import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [notifCount, setNotifCount] = useState(0);

  const LOGO_URL = "https://st4.depositphotos.com/16030310/25210/v/450/depositphotos_252102904-stock-illustration-vector-illustration-blue-letters.jpg";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const fetchNotifCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/count",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      setNotifCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifCount();
    const interval = setInterval(() => {
      fetchNotifCount();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.nav}>
      
      {/* COMPACT CIRCLE LOGO SECTION */}
      <div style={styles.logoContainer} onClick={() => navigate("/home")}>
        <img 
          src={LOGO_URL} 
          alt="Logo" 
          style={styles.logoImg} 
          onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=LF"; }} 
        />
      </div>

      <div style={styles.links}>
        <Link to="/home" style={styles.link}>Home</Link>
        <Link to="/add" style={styles.link}>Report/Found</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/about" style={styles.link}>About Us</Link>

        <button onClick={() => navigate("/my-claims")} style={styles.btn}>
          My Claims
        </button>

        <button onClick={() => navigate("/my-items")} style={styles.btn}>
          My Items
        </button>

        {username && (
          <span style={styles.user}>
            👤 {username}
          </span>
        )}

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log Out
        </button>

        <button
          onClick={() => navigate("/notifications")}
          style={styles.notifButtonContainer}
        >
          Notifications
          {notifCount > 0 && (
            <span style={styles.badge}>
              {notifCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 30px", // Standard padding
    background: "linear-gradient(90deg, #0f172a, #1e293b)",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Times New Roman', serif",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  logoImg: {
    height: "40px", // Reduced from 60px to 50px
    width: "40px",  // Reduced from 60px to 50px
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #38bdf8",
  },
  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "17px",
  },
  user: {
    background: "#1e293b",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    color: "#e2e8f0"
  },
  btn: {
    background: "#3b82f6",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontFamily: "'Times New Roman', serif",
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontFamily: "'Times New Roman', serif",
    fontWeight: "bold"
  },
  notifButtonContainer: {
    position: "relative",
    background: "#facc15",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    color: "#0f172a",
    cursor: "pointer",
    fontSize: "15px",
    fontFamily: "'Times New Roman', serif",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold"
  },
  badge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "bold",
    border: "1px solid white"
  }
};

export default Navbar;