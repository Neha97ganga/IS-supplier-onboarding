import { useState } from "react";
import { addSupplier } from "../api";

function AddSupplier() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  await addSupplier({
    supplier_name: name,
    category
  });

  setMessage("Supplier added successfully");
  setName("");
  setCategory("");
};


  return (
    <div className="card">
      <h3>Add Supplier</h3>
      <p className="subtitle">Enter supplier details to onboard</p>

      <form onSubmit={handleSubmit}>
        <label>Supplier Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., ABC Foods Pvt Ltd"
          required
        />

        <label>Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          <option>Raw Material</option>
          <option>Packaging Materials</option>
          <option>Logistics</option>
        </select>

        <button type="submit">Save Supplier</button>
      </form>

      {message && <p className="success">{message}</p>}
    </div>
  );
}

export default AddSupplier;
