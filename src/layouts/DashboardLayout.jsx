import { Menu } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDemo } from "../contexts/DemoContext";
import Sidebar from "../components/Sidebar"; // Pastikan path importnya sesuai

export default function DashboardLayout({ admin = false }) {
  const { currentUser } = useDemo();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-shell">
      {/* Komponen Sidebar yang sudah dipisah */}
      <Sidebar admin={admin} open={open} setOpen={setOpen} />

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <button
            className="icon-button dashboard-menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div>
            <small>
              {admin ? "Panel Administrator" : "Dashboard Pengguna"}
            </small>
            <strong>
              {location.pathname.includes("admin")
                ? "Kelola sistem"
                : "SewaBarangSekitar"}
            </strong>
          </div>
          <div className="topbar-user">
            <img src={currentUser?.avatar} alt="" />
            <span>{currentUser?.name}</span>
          </div>
        </header>
        
        <div className="dashboard-page">
          <Outlet />
        </div>
      </section>
    </div>
  );
}