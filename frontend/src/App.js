import { useState } from "react";
import SupplierList from "./components/SupplierList";
import AddSupplier from "./components/AddSupplier";
import UploadDocument from "./components/UploadDocument";
import "./App.css";

function App() {
  const [view, setView] = useState("list");

  return (
    <div>
      <header>
        <h2>Supplier Onboarding & Compliance System</h2>
        <button onClick={() => setView("list")}>Suppliers</button>
        <button onClick={() => setView("add")}>Add Supplier</button>
        <button onClick={() => setView("upload")}>Upload Document</button>
      </header>

      <main>
        {view === "list" && <SupplierList />}
        {view === "add" && <AddSupplier />}
        {view === "upload" && <UploadDocument />}
      </main>
    </div>
  );
}

export default App;
