import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyItems() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items/my-items", {
        headers: { Authorization: "Bearer " + token },
      });
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/items/${id}`, {
          headers: { Authorization: "Bearer " + token },
        });
        fetchItems();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 🔥 FIXED: Cloudinary + Local Image Logic
  const getImageUrl = (item) => {
    const imgPath = (item.images && item.images.length > 0) ? item.images[0] : item.image;
    if (!imgPath) return "https://via.placeholder.com/300?text=No+Image";
    
    // Agar Cloudinary URL hai toh direct return karo
    if (imgPath.startsWith("http")) return imgPath;
    
    // Purani local images ke liye path clean karke localhost jodo
    const cleanPath = imgPath.replace(/^uploads\//, "");
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  return (
    <div style={styles.page}>
      
      <style>
        {`
          .item-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
          }
          .item-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(0,0,0,0.7) !important;
            z-index: 10;
          }
          /* 🔥 Read More / Truncation Logic */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            text-overflow: ellipsis;
            min-height: 36px; /* Box size maintain rahega */
          }
        `}
      </style>

      <div style={styles.header}>
        <h2 style={styles.heading}>My Uploaded Items</h2>
        <p style={styles.tagline}>Manage and track the items you have listed</p>
      </div>

      <div style={styles.grid}>
        {items.map((item) => {
          const isLong = item.description && item.description.length > 60;

          return (
            <div key={item._id} className="item-card" style={styles.card}>
              <div style={styles.statusBadge}>{item.status?.toUpperCase() || "ACTIVE"}</div>

              <div style={styles.imageContainer}>
                <img
                  src={getImageUrl(item)}
                  alt=""
                  style={styles.image}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error"; }}
                />
              </div>

              <div style={styles.content}>
                <h3 style={styles.title}>{item.title}</h3>
                
                {/* 🔥 Description with Line Clamp */}
                <div className="line-clamp-2" style={styles.descriptionText}>
                  {item.description || "No description provided."}
                </div>
                
                {isLong && (
                  <span style={{color: '#3b82f6', fontSize: '11px', cursor: 'pointer'}}>
                    Read more...
                  </span>
                )}
                
                <div style={styles.divider}></div>

                <div style={styles.infoRow}>
                  <span style={styles.infoText}>📍 {item.location}</span>
                  <span style={styles.infoText}>📞 {item.contact || "N/A"}</span>
                </div>
              </div>

              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => navigate(`/edit/${item._id}`)}>
                  Edit
                </button>
                <button style={styles.deleteBtn} onClick={() => deleteItem(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px 20px", background: "#0a1120", minHeight: "100vh", color: "white" },
  header: { textAlign: "center", marginBottom: "30px" },
  heading: { fontSize: "32px", fontFamily: "'Times New Roman', serif" },
  tagline: { color: "#94a3b8", fontSize: "14px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px", maxWidth: "1300px", margin: "0 auto" },
  card: { background: "#1e293b", borderRadius: "15px", position: "relative", overflow: "hidden", border: "1px solid #334155", display: "flex", flexDirection: "column", height: "420px", transition: "0.3s" },
  statusBadge: { position: "absolute", top: "10px", right: "10px", background: "#3b82f6", fontSize: "10px", padding: "3px 8px", borderRadius: "8px", zIndex: 2 },
  imageContainer: { width: "100%", height: "180px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  content: { padding: "15px", flexGrow: 1 },
  title: { fontSize: "20px", color: "#3b82f6", fontFamily: "'Times New Roman', serif", marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  descriptionText: { fontSize: "13px", color: "#cbd5e1", marginBottom: "5px", lineHeight: "1.4" },
  divider: { height: "1px", background: "#334155", margin: "10px 0" },
  infoRow: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" },
  actions: { display: "flex", padding: "0 15px 15px 15px", gap: "10px", marginTop: "auto" },
  editBtn: { flex: 1, background: "#334155", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", fontFamily: "'Times New Roman', serif", cursor: "pointer", fontWeight: "bold" },
  deleteBtn: { flex: 1, background: "#ef4444", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", fontFamily: "'Times New Roman', serif", cursor: "pointer", fontWeight: "bold" }
};

export default MyItems;