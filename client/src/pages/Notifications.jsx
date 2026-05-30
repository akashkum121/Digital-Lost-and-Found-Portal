import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      setData(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 MARK SINGLE AS READ
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/read/${id}`,
        {},
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      fetchNotifications(); // refresh

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 MARK ALL AS READ
  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/read-all",
        {},
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Notifications 🔔</h2>

        {data.length > 0 && (
          <button onClick={markAllRead} style={styles.readAllBtn}>
            Mark All Read
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <p>No notifications</p>
      ) : (
        data.map((n) => (
          <div
            key={n._id}
            onClick={() => markAsRead(n._id)}
            style={{
              ...styles.card,
              background: n.read ? "#1e293b" : "#22c55e",
              color: n.read ? "white" : "black"
            }}
          >
            {n.message}

            {!n.read && <span style={styles.new}>NEW</span>}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  readAllBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  card: {
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between"
  },
  new: {
    background: "red",
    color: "white",
    padding: "2px 6px",
    borderRadius: "6px",
    fontSize: "10px"
  }
};

export default Notifications;