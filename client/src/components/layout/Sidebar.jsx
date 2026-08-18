import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiClipboard,
  FiCalendar,
  FiLogOut,
  FiHome,
} from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../constants/roles";
import Modal from "../common/Modal";
import Button from "../common/Button";

const NAV_SECTIONS_BY_ROLE = {
  [ROLE_ADMIN]: [
    {
      label: "Admin Panel",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
        { to: "/members", label: "Manage Members", icon: <FiUsers /> },
        { to: "/menu", label: "Manage Menus", icon: <FiClipboard /> },
        { to: "/ingredients", label: "Menu Ingredients", icon: <GiKnifeFork /> },
        { to: "/reservation", label: "Reservations", icon: <FiCalendar /> },
      ],
    },
  ],
  [ROLE_MEMBER]: [
    {
      label: "Guest Services",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
        { to: "/reservation/reserve", label: "Reserve Table", icon: <FiCalendar /> },
        { to: "/reservation/history", label: "Reservation History", icon: <FiClipboard /> },
      ],
    },
  ],
};

function Sidebar({ role = ROLE_ADMIN, onLogout, isOpen = false, onNavigate }) {
  const sections = NAV_SECTIONS_BY_ROLE[role] || NAV_SECTIONS_BY_ROLE[ROLE_ADMIN];
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };

  return (
    <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">
          <GiKnifeFork />
        </span>
        <span className="sidebar__brand-text">
          <span className="sidebar__brand-title">Esemka Foodcourt</span>
          <span className="sidebar__brand-subtitle">Management system</span>
        </span>
      </div>

      <nav className="sidebar__nav">
        {sections.map((section) => (
          <div className="sidebar__section" key={section.label}>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `sidebar__nav-item${isActive ? " sidebar__nav-item--active" : ""}`
                }
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

            <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__logout"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <span className="sidebar__nav-icon">
            <FiLogOut />
          </span>
          <span>Logout</span>
        </button>
      </div>

      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Keluar dari akun?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmLogout}>
              Logout
            </Button>
          </>
        }
      >
        <p className="text-muted">
          Kamu akan keluar dari sesi ini dan perlu login kembali untuk mengakses dashboard.
        </p>
      </Modal>
    </aside>
  );
}

export default Sidebar;
