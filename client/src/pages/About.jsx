import React from "react";

function About() {
  const team = [
    { name: "Chetna", roll: "2202200100039", role: "Team Leader/Full Stack Developer" },
    { name: "Abhay Gautam", roll: "2202200100003", role: "Backend Developer" },
    { name: "Akash Kumar", roll: "2202200100012", role: "UX/UI Strategist" }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* SECTION 1: ABOUT - Updated to match Screenshot 2026-05-04 191257.png */}
        <h1 style={styles.mainTitle}>Lost&Found: Our Mission & Values</h1>

        <p style={styles.description}>
          Lost&Found was created with a simple mission: to make the process of recovering lost items and reporting found items easier, faster, and more transparent. We are a community-driven digital platform connecting good Samaritans with those who have misplaced their belongings.
        </p>

        {/* SECTION 2: VISION & SECURITY */}
        <div style={styles.gridTwoColumn}>
          <div style={styles.infoBox}>
            <h3 style={styles.iconHeading}>🎯 Our Vision</h3>
            <p style={styles.boxText}>
              To be the leading global platform for lost and found, leveraging technology to build trust and accountability within communities.
            </p>
          </div>
          <div style={styles.infoBox}>
            <h3 style={styles.iconHeading}>🛡️ Security and Privacy</h3>
            <p style={styles.boxText}>
              We prioritize the privacy of our users. Personal details are only shared once a match is confirmed.
            </p>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* SECTION 4: TEAM SECTION */}
        <h2 style={styles.subTitle}>Meet Our Team</h2>
        <p style={styles.teamTagline}>Developed with ❤️ by Team Silent Coders</p>

        <div style={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} style={styles.memberCard}>
              <div style={styles.avatar}>{member.name.charAt(0)}</div>
              <h3 style={styles.memberName}>{member.name}</h3>
              <p style={styles.memberRoll}>{member.roll}</p>
              <p style={styles.memberRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "60px 20px",
    background: "#0a1120", 
    minHeight: "100vh",
    color: "white",
    fontFamily: "'Times New Roman', serif",
    display: "flex",
    justifyContent: "center"
  },
  container: {
    maxWidth: "1100px",
    textAlign: "left"
  },
  // 🔥 Heading style updated based on Screenshot 2026-05-04 191257.png
  mainTitle: {
    fontSize: "48px",
    color: "#2563eb", // Bright blue matching the image
    fontWeight: "bold",
    fontFamily: "'Times New Roman', serif", // Serif font as seen in image
    marginBottom: "30px",
    letterSpacing: "0.5px"
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#cbd5e1",
    marginBottom: "60px"
  },
  gridTwoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    marginBottom: "40px"
  },
  iconHeading: {
    fontSize: "24px",
    color: "white",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold"
  },
  boxText: {
    fontSize: "16px",
    color: "#94a3b8",
    lineHeight: "1.5"
  },
  divider: {
    border: "0",
    borderTop: "1px solid #1e293b",
    margin: "50px 0"
  },
  subTitle: {
    fontSize: "36px",
    textAlign: "center",
    marginBottom: "10px",
    fontWeight: "bold"
  },
  teamTagline: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: "50px",
    fontStyle: "italic"
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px"
  },
  memberCard: {
    background: "#161e2d",
    padding: "30px",
    borderRadius: "15px",
    border: "1px solid #1e293b",
    textAlign: "center"
  },
  avatar: {
    width: "60px",
    height: "60px",
    background: "#2563eb",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 auto 15px"
  },
  memberName: { fontSize: "20px", margin: "10px 0 5px" },
  memberRoll: { fontSize: "14px", color: "#38bdf8", marginBottom: "5px" },
  memberRole: { fontSize: "14px", color: "#94a3b8" }
};

export default About;