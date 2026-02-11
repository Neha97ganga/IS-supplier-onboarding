import { useState } from "react";

function RuleGenerator() {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !docType) {
      alert("Select document type and file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", docType);

    try {
      setLoading(true);
      console.log("🚀 Sending request using fetch");

      const res = await fetch("http://127.0.0.1:5000/sample-documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Backend error:", data);
        alert(data.error || "Rule generation failed");
        return;
      }

      console.log("✅ Rules received:", data);
      setResult(data.rules);

    } catch (err) {
      console.error("❌ Fetch failed:", err);
      alert("Network or backend crash");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Generate Rules from Sample Supplier Document</h3>

      <form onSubmit={handleSubmit}>
        <label>Document Type</label>
        <select
  value={docType}
  onChange={(e) => setDocType(e.target.value)}
  required
>
  <option value="">Select</option>

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
  <option>Refrigerated Vehicle Capability Certificate</option>
  <option>Temperature Monitoring / Calibration Certificate</option>
</select>


        <label>Upload Sample Document (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Rules"}
        </button>
      </form>

      {result && (
        <pre style={{ marginTop: 16 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default RuleGenerator;
