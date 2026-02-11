import { useState, useEffect } from "react";
import { uploadDocument, getSuppliers } from "../api";

function UploadDocument() {
  const [supplier, setSupplier] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Load suppliers from backend
  useEffect(() => {
    getSuppliers().then(setSuppliers);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("supplier_id", supplier);
    formData.append("document_type", docType);
    formData.append("file", file);

    try {
      const result = await uploadDocument(formData);

      setMessage(
        `Document: ${result.document_status} | Supplier: ${result.supplier_status}`
      );
    } catch (err) {
      setMessage("Upload failed");
    }

    setSupplier("");
    setDocType("");
    setFile(null);
  };

  return (
    <div className="card">
      <h3>Upload Document</h3>
      <p className="subtitle">Upload compliance documents for suppliers</p>

      <form onSubmit={handleSubmit}>
        {/* Supplier Dropdown */}
        <label>Supplier</label>
        <select
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          required
        >
          <option value="">Select supplier</option>

          {suppliers.map((s) => (
            <option key={s.supplier_id} value={s.supplier_id}>
              {s.supplier_name}
            </option>
          ))}
        </select>

        {/* Document Type */}
        <label>Document Type</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          required
        >
          <option value="">Select document</option>
          <option>Business Registration Certificate</option>
          <option>GST Registration Certificate</option>
          <option>FSSAI License</option>
          <option>ISO 22000 Certificate</option>
          <option>Quality Audit Report</option>
          <option value="COA">Certificate of Analysis (COA)</option>
          <option>ESG Declaration</option>
          <option>Food-Grade Compliance Certificate</option>
          <option>Transport License</option>
          <option>Insurance Certificate</option>
        </select>

        {/* File Upload */}
        <label>Choose File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button type="submit">Upload Document</button>
      </form>

      {/* Decision Message */}
      {message && (
        <p
          className={
            message.includes("REJECT")
              ? "error"
              : message.includes("ON_HOLD")
              ? "warning"
              : "success"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadDocument;
