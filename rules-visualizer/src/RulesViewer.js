import React, { useEffect, useState } from "react";

function RulesViewer() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetch("https://is-supplier-onboarding-1.onrender.com/rules/logic")
      .then(res => res.json())
      .then(data => setRules(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Knowledge Base (FOL Rules)</h2>

      {rules.map((rule) => (
        <div className="rule-card" key={rule.check_id}>

          {/* Document + Rule */}
          <h3>
            {rule.document_type} — {rule.check_id}
          </h3>

          {/* Description */}
          <p>
            <strong>Description:</strong><br />
            {rule.description}
          </p>

          {/* Severity */}
          <p>
            <strong>Severity:</strong>{" "}
            <span className={`severity ${rule.severity}`}>
              {rule.severity}
            </span>
          </p>

          {/* 🔥 FOL RULE */}
          <div className="fol-box">
            <strong>FOL Rule:</strong>

            <pre>
              {rule.logic_rule
                ?.replace(/forall/g, "∀")
                ?.replace(/exists/g, "∃")}
            </pre>

          </div>

        </div>
      ))}
    </div>
  );
}

export default RulesViewer;