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