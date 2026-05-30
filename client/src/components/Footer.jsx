import { Link } from "react-router-dom";
import { useState } from "react";

function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleMouseEnter = (id) => setHoveredLink(id);
  const handleMouseLeave = () => setHoveredLink(null);

  const CustomLink = ({ to, label, id }) => (
    <p style={styles.linkContainer}>
      <Link
        to={to}
        style={{ ...styles.link, ...(hoveredLink === id ? styles.linkHover : {}) }}
        onMouseEnter={() => handleMouseEnter(id)}
        onMouseLeave={handleMouseLeave}
      >
        {label}
      </Link>
    </p>
  );

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Section 1: Brand */}
        <div style={styles.section}>
          <h4 style={styles.sectionHeading}>Lost & Found Portal</h4>
          <p style={styles.descriptionText}>
            Connecting lost items with their owners, one report at a time. Secure, fast, and community-focused.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div style={styles.section}>
          <h4 style={styles.sectionHeading}>Quick Links</h4>
          <CustomLink to="/about" label="About Us" id="about" />
          <CustomLink to="/home" label="Home" id="home" />
          <CustomLink to="/dashboard" label="Dashboard" id="dashboard" />
          <CustomLink to="/my-items" label="My Items" id="myItems" />
        </div>

        {/* Section 3: Team Credits */}
        <div style={styles.section}>
          <h4 style={styles.sectionHeading}>Team Credits</h4>
          <p style={styles.creditText}>Abhay Gautam (2202200100003)</p>
          <p style={styles.creditText}>Akash Kumar (2202200100012)</p>
          <p style={styles.creditText}>Chetna (2202200100039)</p>
        </div>

        {/* Section 4: Stay Connected - Font Fixed Here */}
        <div style={styles.section}>
          <h4 style={styles.sectionHeading}>Stay Connected</h4>
          <div style={styles.contactContainer}>
            <span style={styles.mailIcon}>✉️</span>
            {/* 🔥 FONT FIXED: ab ye descriptionText jaise font mein hi dikhega */}
            <span style={styles.mailText}>silentcoders@gmail.com</span>
          </div>
          <p style={styles.descriptionText}>
            Follow us for updates on successful reunions and community events.
          </p>
        </div>
      </div>

      <div style={styles.bottom}>
        <p style={styles.bottomText}>© 2026 Lost & Found Portal</p>
        <p style={styles.bottomText}>Made with ❤️ by Team Silent Coders</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#0b1120",
    color: "#94a3b8",
    padding: "60px 40px 20px 40px",
    marginTop: "50px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "20px",
  },
  section: {
    flex: "1",
    minWidth: "220px",
    marginBottom: "20px",
  },
  sectionHeading: {
    fontSize: "22px",
    fontFamily: "'Times New Roman', serif",
    color: "white",
    marginTop: "0px",
    marginBottom: "20px",
    fontWeight: "bold",
    lineHeight: "1.2",
  },
  descriptionText: {
    fontSize: "16px",
    fontFamily: "'Times New Roman', serif",
    lineHeight: "1.6",
    color: "#94a3b8",
  },
  linkContainer: {
    marginBottom: "12px",
  },
  link: {
    fontSize: "18px",
    fontFamily: "'Times New Roman', serif",
    textDecoration: "none",
    color: "#94a3b8",
    transition: "all 0.3s ease",
  },
  linkHover: {
    color: "#38bdf8",
    paddingLeft: "5px",
  },
  creditText: {
    fontSize: "17px",
    fontFamily: "'Times New Roman', serif",
    marginBottom: "8px",
    color: "#94a3b8",
  },
  contactContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    color: "white",
  },
  mailIcon: {
    fontSize: "28px",
  },
  mailText: {
    fontSize: "16px",
    fontFamily: "'Times New Roman', serif", // <--- SAME FONT AS OTHERS
    lineHeight: "1.6", // added to match description text flow
    color: "white", // explicitly white for visibility
  },
  bottom: {
    borderTop: "1px solid #1e293b",
    marginTop: "40px",
    paddingTop: "20px",
    textAlign: "center",
  },
  bottomText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "5px 0",
  },
};

export default Footer;