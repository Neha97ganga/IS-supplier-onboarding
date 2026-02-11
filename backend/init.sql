CREATE TABLE suppliers (
    supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_name TEXT,
    category TEXT,
    status TEXT
);

CREATE TABLE documents (
    document_id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    document_type TEXT,
    file_path TEXT,
    upload_date TEXT
);

CREATE TABLE decisions (
    decision_id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    decision TEXT,
    reason TEXT
);
CREATE TABLE evaluations (
    evaluation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER,
    criteria TEXT,
    score INTEGER
);
CREATE TABLE rules (
  rule_id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_type TEXT,
  required_checks TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_type TEXT,
  check_id TEXT,
  description TEXT,
  severity TEXT
);

CREATE TABLE IF NOT EXISTS rule_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER,
  document_type TEXT,
  check_id TEXT,
  result TEXT
);

CREATE TABLE IF NOT EXISTS document_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER,
  document_type TEXT,
  status TEXT,
  checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
