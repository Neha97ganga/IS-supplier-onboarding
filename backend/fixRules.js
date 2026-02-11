const db = require("./db");

db.run(`DROP TABLE IF EXISTS rules`, (err) => {
  if (err) return console.error(err);

  console.log("🧹 Old rules table dropped");

  db.run(`
    CREATE TABLE rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_type TEXT,
      check_id TEXT,
      description TEXT,
      severity TEXT
    )
  `, (err) => {
    if (err) console.error(err);
    else console.log("✅ New rules table created");
    process.exit();
  });
});
