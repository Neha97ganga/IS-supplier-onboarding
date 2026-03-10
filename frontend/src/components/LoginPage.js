import { useState, useEffect } from "react";
import { addSupplier } from "../api";

function LoginPage({ onLoginAdmin, onLoginSupplier }) {
  const [mode, setMode] = useState("supplier"); // "supplier" | "admin"
  const [supplierTab, setSupplierTab] = useState("existing"); // "existing" | "new"
  const [existingId, setExistingId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [savedSuppliers, setSavedSuppliers] = useState([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("savedSuppliers");
    if (stored) {
      try {
        setSavedSuppliers(JSON.parse(stored));
      } catch {
        setSavedSuppliers([]);
      }
    }
  }, []);

  const persistSupplier = (supplier) => {
    const updated = [...savedSuppliers, supplier];
    setSavedSuppliers(updated);
    window.localStorage.setItem("savedSuppliers", JSON.stringify(updated));
  };

  const handleSupplierRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await addSupplier({
        supplier_name: name,
        category
      });

      if (!res.supplier_id) {
        setMessage("Failed to register supplier");
        return;
      }

      persistSupplier({
        id: res.supplier_id,
        name,
        category
      });

      setMessage(
        `Registered successfully. Your Supplier ID is ${res.supplier_id}. Use this ID to log in next time.`
      );
      setExistingId(String(res.supplier_id));
      setName("");
      setCategory("");
      setSupplierTab("existing");
    } catch (err) {
      console.error(err);
      setMessage("Registration failed");
    }
  };

  const handleSupplierLogin = (e) => {
    e.preventDefault();
    if (!existingId) return;
    onLoginSupplier(existingId);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!adminCode || adminCode.trim() !== "admin123") {
      setMessage("Invalid admin access code");
      return;
    }
    onLoginAdmin();
  };

  return (
    <div className="card login-card">
      <h3>Welcome</h3>
      <p className="subtitle">
        Choose whether you are a supplier or an admin.
      </p>

      <div className="login-role-toggle">
        <button
          type="button"
          className={mode === "supplier" ? "active" : ""}
          onClick={() => {
            setMode("supplier");
            setMessage("");
          }}
        >
          Supplier
        </button>
        <button
          type="button"
          className={mode === "admin" ? "active" : ""}
          onClick={() => {
            setMode("admin");
            setMessage("");
          }}
        >
          Admin
        </button>
      </div>

      {mode === "supplier" && (
        <div className="login-panel">
          <div className="tab-toggle">
            <button
              type="button"
              className={supplierTab === "existing" ? "active" : ""}
              onClick={() => setSupplierTab("existing")}
            >
              Existing supplier
            </button>
            <button
              type="button"
              className={supplierTab === "new" ? "active" : ""}
              onClick={() => setSupplierTab("new")}
            >
              New supplier
            </button>
          </div>

          {supplierTab === "existing" && (
            <form onSubmit={handleSupplierLogin}>
              <label>Supplier ID</label>
              <input
                value={existingId}
                onChange={(e) => setExistingId(e.target.value)}
                placeholder="Enter your Supplier ID"
                required
              />

              {savedSuppliers.length > 0 && (
                <div className="saved-suppliers">
                  <label>Or pick a saved supplier</label>
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      setExistingId(val);
                    }}
                    value={existingId || ""}
                  >
                    <option value="">Select from previous logins</option>
                    {savedSuppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category}) – ID {s.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit">Continue as Supplier</button>
            </form>
          )}

          {supplierTab === "new" && (
            <form onSubmit={handleSupplierRegister}>
              <label>Company Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., ABC Foods Pvt Ltd"
                required
              />

              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="Raw Materials (Ingredients/Spices)">
                  Raw Material
                </option>
                <option value="Packaging Materials (Food-Grade)">
                  Packaging Materials
                </option>
                <option value="Logistics">Logistics</option>
              </select>

              <button type="submit">Register & get Supplier ID</button>
            </form>
          )}
        </div>
      )}

      {mode === "admin" && (
        <form onSubmit={handleAdminLogin} className="login-panel">
          <p className="subtitle">
            Admins can add suppliers, upload documents and configure rules.
          </p>
          <label>Admin access code</label>
          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Enter admin code (demo: admin123)"
            required
          />
          <button type="submit">Continue as Admin</button>
        </form>
      )}

      {message && <p className="success" style={{ marginTop: 16 }}>{message}</p>}
    </div>
  );
}

export default LoginPage;

