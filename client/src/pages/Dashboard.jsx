import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [claims, setClaims] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/claims/owner",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      setClaims(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, action) => {
    await axios.put(
      `http://localhost:5000/api/claims/${action}/${id}`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchClaims();
  };

  const confirmGiven = async (id) => {
    await axios.put(
      `http://localhost:5000/api/claims/handover/owner/${id}`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    alert("Marked as given ✅");
    fetchClaims();
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") return styles.accepted;
    if (status === "Rejected") return styles.rejected;
    return styles.pending;
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.mainHeading}>Claim Requests</h2>

      <div style={styles.grid}>
        {claims.map((claim) => (
          <div key={claim._id} style={styles.card}>
            
            <div style={styles.imageBox}>
              {claim.itemId?.images?.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${claim.itemId.images[0]}`}
                  style={styles.image}
                  alt="item"
                />
              ) : (
                <div style={styles.noImage}>No Image</div>
              )}
            </div>

            <div style={styles.cardContent}>
              <h3 style={styles.title}>{claim.itemId?.title}</h3>

              <p style={styles.infoText}>
                <b>Desc:</b> {claim.itemId?.description?.slice(0, 50)}
              </p>

              <p style={styles.infoText}>
                <b>By:</b> {claim.claimantId?.name}
              </p>

              <p style={styles.infoText}>
                <b>Status:</b>{" "}
                <span style={{ ...styles.statusSpan, ...getStatusStyle(claim.status) }}>
                  {claim.status}
                </span>
              </p>

              <div style={styles.emailBox}>
                {claim.claimantId?.email || "User Info"}
              </div>
            </div>

            <div style={styles.footerAction}>
              {claim.status === "Pending" && (
                <div style={styles.btnGroup}>
                  <button
                    style={styles.acceptBtn}
                    onClick={() => updateStatus(claim._id, "accept")}
                  >
                    Accept
                  </button>

                  <button
                    style={styles.rejectBtn}
                    onClick={() => updateStatus(claim._id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              )}

              {claim.status === "Approved" && !claim.handoverByOwner && (
                <button
                  style={styles.handoverBtn}
                  onClick={() => confirmGiven(claim._id)}
                >
                  I Gave Item
                </button>
              )}

              {claim.handoverByOwner && claim.handoverByClaimant && (
                <p style={styles.completed}>✅ Delivered</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "50px 30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Times New Roman', serif"
  },

  mainHeading: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "40px",
    fontWeight: "bold"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
    maxWidth: "1300px",
    margin: "0 auto"
  },

  card: {
    background: "#334155", 
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    transition: "0.3s"
  },

  imageBox: {
    width: "100%",
    height: "180px",
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "18px"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  noImage: {
    textAlign: "center"
  },

  cardContent: {
    padding: "20px",
    flexGrow: 1,
    background: "#1e293b"
  },

  title: {
    fontSize: "20px",
    color: "#38bdf8",
    marginBottom: "12px",
    fontWeight: "bold"
  },

  infoText: {
    fontSize: "14px",
    margin: "6px 0",
    color: "#cbd5e1"
  },

  statusSpan: {
    fontWeight: "bold"
  },

  emailBox: {
    marginTop: "15px",
    background: "#0f172a",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#38bdf8",
    textAlign: "left"
  },

  footerAction: {
    padding: "15px",
    background: "#1e293b"
  },

  btnGroup: {
    display: "flex",
    gap: "10px"
  },

  acceptBtn: {
    flex: 1,
    background: "#22c55e",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "'Times New Roman', serif" // Font added
  },

  rejectBtn: {
    flex: 1,
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "'Times New Roman', serif" // Font added
  },

  handoverBtn: {
    width: "100%",
    background: "#3b82f6",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "'Times New Roman', serif" // Font added
  },

  accepted: { color: "#22c55e" },
  rejected: { color: "#ef4444" },
  pending: { color: "#facc15" },

  completed: {
    textAlign: "center",
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: "16px"
  }
};

export default Dashboard;