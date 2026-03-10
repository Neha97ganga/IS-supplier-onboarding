import { useEffect, useState } from "react";
import { getSuppliers } from "../api";

function SupplierList({ onSelectSupplier }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
  }, []);

  return (
    <div className="card">
      <h3>Suppliers</h3>
      <p className="subtitle">
        {onSelectSupplier
          ? "Click a supplier to open full profile and decision details"
          : "List of onboarded suppliers and their status"}
      </p>

      <table>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Supplier Name</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr
              key={s.supplier_id}
              className={onSelectSupplier ? "clickable-row" : ""}
              onClick={() =>
                onSelectSupplier ? onSelectSupplier(s.supplier_id) : null
              }
            >
              <td>{s.supplier_id}</td>
              <td>{s.supplier_name}</td>
              <td>{s.category}</td>
              <td>
                <span className={`status ${s.status.toLowerCase()}`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierList;
