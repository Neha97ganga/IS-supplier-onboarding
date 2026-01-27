const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_req, res) => {
  res.send("Backend is running");
});

/* ---------- File Upload Config ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------- Add Supplier ---------- */
app.post("/suppliers", (req, res) => {
  const { supplier_name, category } = req.body;

  db.run(
    `INSERT INTO suppliers (supplier_name, category, status)
     VALUES (?, ?, ?)`,
    [supplier_name, category, "Pending"],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Supplier added", supplier_id: this.lastID });
    }
  );
});

/* ---------- Get Suppliers ---------- */
app.get("/suppliers", (req, res) => {
  db.all(`SELECT * FROM suppliers`, [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* ---------- Upload Document ---------- */
app.post("/documents", upload.single("file"), (req, res) => {
  const { supplier_id, document_type } = req.body;
  const file_path = req.file.path;

  db.run(
    `INSERT INTO documents
     (supplier_id, document_type, file_path, upload_date)
     VALUES (?, ?, ?, datetime('now'))`,
    [supplier_id, document_type, file_path],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Document uploaded" });
    }
  );
});

/* ---------- Start Server ---------- */
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
