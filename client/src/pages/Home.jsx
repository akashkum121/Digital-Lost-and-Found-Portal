import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [loadingClaim, setLoadingClaim] = useState(false);

  const token = localStorage.getItem("token");

  const slides = [
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  ];

  // Fetch Items - Only once on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Slider Interval - Optimized to only update index
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter items whenever search or main items change
  useEffect(() => {
    filterItems();
  }, [searchLocation, searchDate, items]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: "Bearer " + token }
      });
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filterItems = () => {
    let filtered = items;
    if (searchLocation) {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    if (searchDate) {
      filtered = filtered.filter(item => {
        if (!item.lostDate) return false;
        const itemDate = new Date(item.lostDate).toISOString().split("T")[0];
        return itemDate === searchDate;
      });
    }
    setFilteredItems(filtered);
  };

  const submitClaim = async () => {
    if (!claimMessage) return alert("Enter message");
    try {
      setLoadingClaim(true);
      await axios.post(
        "http://localhost:5000/api/claims/add",
        { itemId: selectedItem._id, message: claimMessage },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("Claim Submitted");
      setClaimOpen(false);
      setSelectedItem(null);
      setClaimMessage("");
      fetchItems();
    } catch (err) {
      alert(err.response?.data || "Claim Failed");
    } finally {
      setLoadingClaim(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "lost") return "#f87171";
    if (status === "found") return "#60a5fa";
    if (status === "claimed") return "#facc15";
    return "#22c55e";
  };

  return (
    <div style={styles.page}>
      
      <style>
        {`
          .item-card:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      </style>

      {/* HERO SLIDER */}
      <div style={styles.slider}>
        <img src={slides[currentSlide]} style={styles.sliderImage} alt="Hero" />
        <div style={styles.overlay}>
          <h1 style={styles.heroTitle}>Lost & Found Portal</h1>
          <p style={styles.heroSub}>Find or report lost items easily</p>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div style={styles.searchBox}>
        <input
          placeholder="Search location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          max="9999-12-31" 
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={{...styles.input, width: "160px"}} 
        />
      </div>

      {/* ITEMS GRID */}
      <div style={styles.grid}>
        {filteredItems.length === 0 ? (
          <h2 style={{ color: "#94a3b8", fontFamily: "'Times New Roman', serif" }}>No items found</h2>
        ) : (
          filteredItems.map(item => {
            const imgName = (item.images && item.images.length > 0) ? item.images[0] : item.image;
            const finalImgUrl = imgName ? `http://localhost:5000/uploads/${imgName}` : "https://via.placeholder.com/300?text=No+Image";
            const isLong = item.description && item.description.length > 100;

            return (
              <div
                key={item._id}
                className="item-card"
                style={styles.card}
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={finalImgUrl}
                  style={styles.image}
                  alt={item.title}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+Loading"; }}
                />

                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <p style={styles.muted}>📍 {item.location}</p>
                  
                  <div className="line-clamp-2" style={styles.desc}>
                    {item.description}
                  </div>
                  
                  {isLong && (
                    <span style={{color: '#60a5fa', fontSize: '12px', cursor: 'pointer', display: 'block', marginTop: '2px'}}>
                      Read more...
                    </span>
                  )}

                  <p style={styles.date}>
                    {item.lostDate ? new Date(item.lostDate).toLocaleDateString() : "No Date"}
                  </p>
                  <span
                    style={{
                      ...styles.badge,
                      background: getStatusColor(item.status)
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ITEM DETAIL MODAL */}
      {selectedItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalHeading}>{selectedItem.title}</h2>
            <div style={styles.modalImgContainer}>
                 <img
                  src={selectedItem.images?.length > 0 
                    ? `http://localhost:5000/uploads/${selectedItem.images[0]}` 
                    : `http://localhost:5000/uploads/${selectedItem.image}`}
                  style={styles.modalImage}
                  alt={selectedItem.title}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }}
                />
            </div>
            <p style={styles.modalText}>{selectedItem.description}</p>
            <p style={styles.modalText}><b>Location:</b> {selectedItem.location}</p>
            <div style={styles.modalActions}>
                <button style={styles.claimBtn} onClick={() => setClaimOpen(true)}>Claim Item</button>
                <button style={styles.closeBtn} onClick={() => setSelectedItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM SUBMISSION MODAL */}
      {claimOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalHeading}>Claim This Item</h3>
            <textarea
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              style={styles.textarea}
              placeholder="Write your message here..."
            />
            <div style={styles.modalActions}>
                <button style={styles.claimBtn} onClick={submitClaim}>
                {loadingClaim ? "Submitting..." : "Submit"}
                </button>
                <button style={styles.closeBtn} onClick={() => setClaimOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: "#0f172a", minHeight: "100vh", color: "white" },
  slider: { height: "300px", position: "relative" },
  sliderImage: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  heroTitle: { fontSize: "36px", fontWeight: "bold", fontFamily: "'Times New Roman', serif" },
  heroSub: { color: "#cbd5f5", fontFamily: "'Times New Roman', serif" },
  searchBox: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    padding: "15px 20px",
    marginTop: "20px",
    background: "#1e293b",
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0a1120",
    color: "white",
    outline: "none",
    fontFamily: "'Times New Roman', serif",
    fontSize: "16px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
    padding: "40px"
  },
  card: {
    background: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "0.2s ease-in-out"
  },
  image: { width: "100%", height: "160px", objectFit: "cover" },
  cardBody: { padding: "12px", fontFamily: "'Times New Roman', serif" },
  cardTitle: { fontSize: "20px", margin: "0 0 5px 0" },
  muted: { color: "#94a3b8", fontSize: "14px", margin: "2px 0" },
  desc: { fontSize: "14px", color: "#cbd4e1", margin: "5px 0", minHeight: "34px" },
  date: { fontSize: "13px", color: "#94a3b8", marginTop: "5px" },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    marginTop: "5px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { background: "#1e293b", color: "white", padding: "30px", borderRadius: "15px", width: "450px", fontFamily: "'Times New Roman', serif", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" },
  modalHeading: { fontSize: "28px", marginBottom: "15px", fontWeight: "bold" },
  modalText: { fontSize: "18px", margin: "10px 0", color: "#cbd5e1" },
  modalImgContainer: { width: "100%", border: "1px solid #475569", borderRadius: "10px", overflow: "hidden", marginBottom: "15px" },
  modalImage: { width: "100%", height: "250px", objectFit: "cover", display: "block" },
  modalActions: { display: "flex", gap: "10px", marginTop: "20px" },
  claimBtn: { background: "#22c55e", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontFamily: "'Times New Roman', serif", fontWeight: "bold" },
  closeBtn: { background: "white", color: "black", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontFamily: "'Times New Roman', serif", fontWeight: "bold" },
  textarea: { width: "100%", height: "100px", marginTop: "10px", padding: "10px", borderRadius: "8px", background: "#0f172a", color: "white", border: "1px solid #334155", fontFamily: "'Times New Roman', serif", fontSize: "16px", outline: "none" }
};

export default Home;