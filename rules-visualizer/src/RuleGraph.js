import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const API = "https://is-supplier-onboarding-1.onrender.com";

function RuleGraph() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetch(`${API}/rules/logic`)
      .then(res => res.json())
      .then(rules => {
        const nodes = [];
        const links = [];

        rules.forEach(r => {
          const doc = r.document_type;
          const check = r.check_id;

          nodes.push({ id: doc });
          nodes.push({ id: check });

          links.push({
            source: doc,
            target: check,
            label: r.severity
          });
        });

        setData({ nodes, links });
      });
  }, []);

  return (
    <div>
      <h2>🧠 Rule Knowledge Graph</h2>
      <ForceGraph2D graphData={data} />
    </div>
  );
}

export default RuleGraph;