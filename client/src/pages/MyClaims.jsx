import { useEffect, useState } from "react";
import axios from "axios";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/claims/my",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setClaims(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") return styles.approved;
    if (status === "Rejected") return styles.rejected;
    return styles.pending;
  };

  return (
    <div style={styles.page}>
      
      {/* ⚡ Zoom Effect CSS - Logic se koi ched-chad nahi */}
      <style>
        {`
          .claim-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
          }
          .claim-card:hover {
            transform: scale(1.04); /* Halka sa zoom */
            box-shadow: 0 10px 25px rgba(0,0,0,0.6) !important;
            z-index: 10;
          }
        `}
      </style>

      <h2 style={styles.heading}>My Claims</h2>

      {claims.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>No claims yet</p>
      ) : (
        <div style={styles.grid}>
          {claims.map((claim) => (
            <div 
              key={claim._id} 
              className="claim-card" // 🔥 Added class here
              style={styles.card}
            >

              {/* IMAGE */}
              {claim.itemId?.images?.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${claim.itemId.images[0]}`}
                  style={styles.image}
                  alt="item"
                />
              ) : claim.itemId?.image ? (
                <img
                  src={`http://localhost:5000/uploads/${claim.itemId.image}`}
                  style={styles.image}
                  alt="item"
                />
              ) : (
                <div style={styles.noImage}>No Image</div>
              )}

              {/* TITLE */}
              <h3 style={styles.title}>
                📌 {claim.itemId?.title || "No Title"}
              </h3>

              {/* LOCATION */}
              <p style={styles.info}>
                📍 <b>Location:</b> {claim.itemId?.location || "N/A"}
              </p>

              {/* DESCRIPTION */}
              <p style={styles.desc}>
                📝 <b>Description:</b> {claim.itemId?.description || "N/A"}
              </p>

              {/* STATUS */}
              <p style={{ ...styles.status, ...getStatusStyle(claim.status) }}>
                {claim.status}
              </p>

              {/* USER MESSAGE */}
              <p style={styles.message}>
                💬 <b>Your Message:</b> {claim.message}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Times New Roman', serif"
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "32px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "25px",
    padding: "10px"
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    cursor: "default"
  },

  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px"
  },

  noImage: {
    height: "160px",
    background: "#334155",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    marginBottom: "10px",
    color: "#94a3b8"
  },

  title: {
    margin: "10px 0 5px",
    fontSize: "18px",
    color: "#f8fafc"
  },

  info: {
    fontSize: "13px",
    marginBottom: "5px",
    color: "#cbd5e1"
  },

  desc: {
    fontSize: "12px",
    color: "#94a3b8",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    lineHeight: "1.4"
  },

  status: {
    fontWeight: "bold",
    marginTop: "12px",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },

  approved: {
    color: "#22c55e"
  },

  rejected: {
    color: "#ef4444"
  },

  pending: {
    color: "#facc15"
  },

  message: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid #334155",
    fontSize: "13px",
    color: "#cbd5e1",
    wordBreak: "break-word",
    fontStyle: "italic"
  }
};

export default MyClaims;