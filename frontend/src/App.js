import { useState } from "react";
import SupplierList from "./components/SupplierList";
import AddSupplier from "./components/AddSupplier";
import UploadDocument from "./components/UploadDocument";
import RuleGenerator from "./components/RuleGenerator";
import AdminSupplierProfile from "./components/AdminSupplierProfile";
import LoginPage from "./components/LoginPage";
import SupplierDashboard from "./components/SupplierDashboard";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("list");
  const [role, setRole] = useState(null); // "admin" | "supplier" | null
  const [supplierId, setSupplierId] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  const handleLogout = () => {
    setRole(null);
    setSupplierId(null);
    setSelectedSupplierId(null);
    setView("list");
    setMenuOpen(false);
  };

  const renderAdminContent = () => {
    return (
      <div className="app-shell">
        <header className="header">
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
          <h2>Supplier Onboarding & Compliance System (Admin)</h2>
          <button
            type="button"
            className="secondary-button header-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <div className="layout">
          <div className={`sidebar ${menuOpen ? "open" : ""}`}>
            <div className="menu-box">
              <div
                className="menu-item"
                onClick={() => {
                  setView("list");
                  setSelectedSupplierId(null);
                  setMenuOpen(false);
                }}
              >
                <span className="arrow">→</span>
                <span>Suppliers</span>
              </div>

              <div
                className="menu-item"
                onClick={() => {
                  setView("add");
                  setMenuOpen(false);
                }}
              >
                <span className="arrow">→</span>
                <span>Add Supplier</span>
              </div>

              <div
                className="menu-item"
                onClick={() => {
                  setView("upload");
                  setMenuOpen(false);
                }}
              >
                <span className="arrow">→</span>
                <span>Upload Document</span>
              </div>

              <div
                className="menu-item"
                onClick={() => {
                  setView("rules");
                  setMenuOpen(false);
                }}
              >
                <span className="arrow">→</span>
                <span>Generate Rules</span>
              </div>
            </div>
          </div>

          <main className={`content ${menuOpen ? "shift" : ""}`}>
            <main>
              {view === "list" && !selectedSupplierId && (
                <SupplierList onSelectSupplier={setSelectedSupplierId} />
              )}
              {view === "list" && selectedSupplierId && (
                <AdminSupplierProfile
                  supplierId={selectedSupplierId}
                  onBack={() => setSelectedSupplierId(null)}
                />
              )}
              {view === "add" && <AddSupplier />}
              {view === "upload" && <UploadDocument />}
              {view === "rules" && <RuleGenerator />}
            </main>
          </main>
        </div>
      </div>
    );
  };

  const renderSupplierContent = () => {
    if (!supplierId) return null;

    return (
      <div className="app-shell">
        <header className="header">
          <h2>Supplier Onboarding Portal</h2>
          <button
            type="button"
            className="secondary-button header-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>
        <main>
          <SupplierDashboard supplierId={supplierId} />
        </main>
      </div>
    );
  };

  if (!role) {
    return (
      <div>
        <header className="header">
          <h2>Supplier Onboarding & Compliance System</h2>
        </header>
        <main>
          <LoginPage
            onLoginAdmin={() => setRole("admin")}
            onLoginSupplier={(id) => {
              setRole("supplier");
              setSupplierId(id);
            }}
          />
        </main>
      </div>
    );
  }

  if (role === "admin") {
    return renderAdminContent();
  }

  return renderSupplierContent();
}

export default App;