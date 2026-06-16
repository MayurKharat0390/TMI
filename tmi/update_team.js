const fs = require('fs');
const file = 'data/team.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.members = data.members.map(m => {
  // Move 2028 management to 2027
  if (m.year === "2028" && (m.team === "Management Team" || m.team === "Directors")) {
    m.year = "2027";
  }
  
  // For 2026 batch (and 2025), add "Ex-" if it's a management role and not already "Ex-"
  if (m.year === "2026" || m.year === "2025") {
    if (m.team === "Management Team" || m.team === "Directors" || m.team === "Ex-Management") {
      if (!m.role.startsWith("Ex-")) {
        m.role = "Ex-" + m.role;
      }
      m.team = "Ex-Management";
    }
  }
  return m;
});

// Remove old duplicates in 2027 if the same person is now in Management in 2027
// The persons who were moved from 2028 to 2027:
const managementNamesIn2027 = data.members
  .filter(m => m.year === "2027" && (m.team === "Management Team" || m.team === "Directors"))
  .map(m => m.name);

data.members = data.members.filter(m => {
  if (m.year === "2027" && managementNamesIn2027.includes(m.name) && m.team !== "Management Team" && m.team !== "Directors") {
    // Drop the old regular member entry for the newly promoted management
    return false;
  }
  return true;
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
