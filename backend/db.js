const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.db");
const initPath = path.join(__dirname, "init.sql");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("📦 Connected to SQLite DB");

    const initSQL = fs.readFileSync(initPath, "utf8");

    db.exec(initSQL, (err) => {
      if (err) console.error("❌ init.sql execution failed:", err.message);
      else console.log("✅ Tables ensured from init.sql");
    });
  }
});

module.exports = db;
