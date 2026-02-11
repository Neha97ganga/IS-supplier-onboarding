import { useState } from "react";
import SupplierList from "./components/SupplierList";
import AddSupplier from "./components/AddSupplier";
import UploadDocument from "./components/UploadDocument";
import RuleGenerator from "./components/RuleGenerator";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("list");

  return (
    <div>
      <header className="header">
  <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
    ☰
  </div>
  <h2>Supplier Onboarding & Compliance System</h2>
</header>

<div className="layout">

  {/* Sidebar */}
  <div className={`sidebar ${menuOpen ? "open" : ""}`}>
    <div className="menu-box">

      <div className="menu-item" onClick={() => { setView("list"); setMenuOpen(false); }}>
        <span className="arrow">→</span>
        <span>Suppliers</span>
      </div>

      <div className="menu-item" onClick={() => { setView("add"); setMenuOpen(false); }}>
        <span className="arrow">→</span>
        <span>Add Supplier</span>
      </div>

      <div className="menu-item" onClick={() => { setView("upload"); setMenuOpen(false); }}>
        <span className="arrow">→</span>
        <span>Upload Document</span>
      </div>

      <div className="menu-item" onClick={() => { setView("rules"); setMenuOpen(false); }}>
        <span className="arrow">→</span>
        <span>Generate Rules</span>
      </div>

    </div>
  </div>

  {/* Main Content */}
  <main className={`content ${menuOpen ? "shift" : ""}`}>
    {/* Your Suppliers Table / Existing Content */}
  </main>

</div>

      <main>
        {view === "list" && <SupplierList />}
        {view === "add" && <AddSupplier />}
        {view === "upload" && <UploadDocument />}
        {view === "rules" && <RuleGenerator />}
      </main>

      
    </div>
  );
}

export default App;