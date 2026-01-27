import { useState } from "react";
import { uploadDocument } from "../api";


function UploadDocument() {
  const [supplier, setSupplier] = useState("");
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("supplier_id", supplier);
  formData.append("document_type", docType);
  formData.append("file", file);

  await uploadDocument(formData);

  setMessage("Document uploaded successfully");


    setMessage("Document uploaded successfully");
    setSupplier("");
    setDocType("");
    setFile(null);
  };

  return (
    <div className="card">
      <h3>Upload Document</h3>
      <p className="subtitle">Upload compliance documents for suppliers</p>

      <form onSubmit={handleSubmit}>
        <label>Supplier</label>
        <select
          value={supplier}
          onChange={e => setSupplier(e.target.value)}
          required
        >
          <option value="">Select supplier</option>
          <option>ABC Foods</option>
          <option>XYZ Textiles</option>
        </select>

        <label>Document Type</label>
        <select
          value={docType}
          onChange={e => setDocType(e.target.value)}
          required
        >
          <option value="">Select document</option>
          <option>Business Registration Certificate</option>
          <option>GST Registration Certificate</option>
          <option>FSSAI License</option>
          <option>ISO 22000 Certificate</option>
          <option>Quality Audit Report</option>
          <option>Certificate of Analysis (COA)</option>
          <option>ESG Declaration</option>
          <option>Food-Grade Compliance Certificate</option>
          <option>Transport License</option>
          <option>Insurance Certificate</option>
        </select>

        <label>Choose File</label>
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          required
        />

        <button type="submit">Upload Document</button>
      </form>

      {message && <p className="success">{message}</p>}
    </div>
  );
}

export default UploadDocument;
