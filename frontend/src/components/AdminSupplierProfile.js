import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getSupplierProfile, getSupplierExplanation } from "../api";

function AdminSupplierProfile({ supplierId, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [explanationError, setExplanationError] = useState("");

  useEffect(() => {
    if (!supplierId) return;

    const load = async () => {
      setLoading(true);
      setError("");
      setExplanation("");
      setExplanationError("");

      try {
        const profileData = await getSupplierProfile(supplierId);
        setProfile(profileData);
      } catch (e) {
        console.error("Profile load failed", e);
        setError("Failed to load supplier profile");
      } finally {
        setLoading(false);
      }

      // Load LLM explanation separately so profile still works even if LLM fails
      try {
        const explanationData = await getSupplierExplanation(supplierId);
        setExplanation(explanationData.explanation);
      } catch (e) {
        console.error("Explanation load failed", e);
        setExplanationError("Failed to load decision explanation");
      }
    };

    load();
  }, [supplierId]);

  if (!supplierId) return null;

  return (
    <div className="card">
      <div className="profile-header">
        <div>
          <h3>Supplier Profile</h3>
          <p className="subtitle">
            Detailed view of documents, checks and final decision
          </p>
        </div>
        {onBack && (
          <button
            type="button"
            className="secondary-button"
            onClick={onBack}
          >
            Back to list
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {profile && (
        <>
          <section className="profile-section">
            <h4>Basic Details</h4>
            <p>
              <strong>Name:</strong> {profile.supplier.supplier_name}
            </p>
            <p>
              <strong>Category:</strong> {profile.supplier.category}
            </p>
            <p>
              <strong>Overall Status:</strong>{" "}
              <span
                className={`status ${profile.supplier.status.toLowerCase()}`}
              >
                {profile.supplier.status}
              </span>
            </p>
          </section>

          <section className="profile-section">
            <h4>Documents & Decisions</h4>
            {profile.documents.length === 0 ? (
              <p>No documents checked yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>Status</th>
                    <th>Checked At</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.document_type}</td>
                      <td>
                        <span
                          className={`status ${doc.status.toLowerCase()}`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td>{new Date(doc.checked_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="profile-section">
            <h4>Rule Check Details</h4>
            {profile.rule_results.length === 0 ? (
              <p>No rule checks recorded.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>Check ID</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.rule_results.map((rr) => (
                    <tr key={rr.id}>
                      <td>{rr.document_type}</td>
                      <td>{rr.check_id}</td>
                      <td>{rr.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="profile-section">
            <h4>LLM explanation (why this decision)</h4>
            {explanationError && <p className="error">{explanationError}</p>}
            {explanation ? (
              <div className="explanation-box">
                <ReactMarkdown>{explanation}</ReactMarkdown>
              </div>
            ) : (
              !explanationError && <p>No explanation available yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default AdminSupplierProfile;

