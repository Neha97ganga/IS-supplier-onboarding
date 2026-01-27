import { useEffect, useState } from "react";
import { getSuppliers } from "../api";

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
  }, []);

  return (
    <div className="card">
      <h3>Suppliers</h3>
      <p className="subtitle">List of onboarded suppliers and their status</p>

      <table>
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.supplier_id}>
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
