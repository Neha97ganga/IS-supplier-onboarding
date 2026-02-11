const db = require("./db");

function decideDocumentStatus(results) {
  let criticalFail = false;
  let majorFail = false;

  for (const r of results) {
    if (r.severity === "critical" && r.result === "fail") criticalFail = true;
    if (r.severity === "major" && r.result === "fail") majorFail = true;
  }

  if (criticalFail) return "REJECT";
  if (majorFail) return "ON_HOLD";
  return "ACCEPT";
}

function decideSupplierStatus(supplier_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT status FROM document_results WHERE supplier_id = ?`,
      [supplier_id],
      (err, rows) => {
        if (err) return reject(err);

        const statuses = rows.map(r => r.status);

        if (statuses.includes("REJECT")) return resolve("REJECT");
        if (statuses.includes("ON_HOLD")) return resolve("ON_HOLD");
        resolve("ACCEPT");
      }
    );
  });
}

module.exports = { decideDocumentStatus, decideSupplierStatus };
