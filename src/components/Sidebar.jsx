import {
  Bell,
  Boxes,
  ChevronLeft,
  ClipboardList,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  PackagePlus,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo"; // Sesuaikan path jika Logo ada di folder yang sama
import { useDemo } from "../contexts/DemoContext";

const userMenu = [
  ["/dashboard", "Ringkasan", LayoutDashboard, true],
  ["/dashboard/barang", "Barang Saya", Boxes],
  ["/dashboard/tambah-barang", "Tambah Barang", PackagePlus],
  ["/dashboard/permintaan", "Permintaan Masuk", ClipboardList],
  ["/dashboard/penyewaan", "Penyewaan Saya", Home],
  ["/dashboard/favorit", "Favorit", Heart],
  ["/dashboard/notifikasi", "Notifikasi", Bell],
  ["/dashboard/profil", "Profil & Pengaturan", Settings],
];

const adminMenu = [
  ["/admin", "Ringkasan Admin", LayoutDashboard, true],
  ["/admin/pengguna", "Kelola Pengguna", Users],
  ["/admin/barang", "Moderasi Barang", Boxes],
  ["/admin/penyewaan", "Semua Penyewaan", ClipboardList],
  ["/admin/laporan", "Laporan & Sengketa", ShieldCheck],
];

export default function Sidebar({ admin, open, setOpen }) {
  const { currentUser, logout } = useDemo();
  const navigate = useNavigate();
  const menu = admin ? adminMenu : userMenu;

  const doLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button
            className="icon-button sidebar-close"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>
        <div className="sidebar-user">
          <img src={currentUser?.avatar} alt="" />
          <div>
            <strong>{currentUser?.name}</strong>
            <span>{admin ? "Administrator" : "Pengguna terverifikasi"}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menu.map(([path, label, Icon, end]) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/">
            <ChevronLeft size={19} />
            Kembali ke situs
          </NavLink>
          <button onClick={doLogout}>
            <LogOut size={19} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay untuk tampilan mobile */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}
    </>
  );
}