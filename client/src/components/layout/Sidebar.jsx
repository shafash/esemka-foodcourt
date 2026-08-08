import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiClipboard,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";
import { ROLE_ADMIN, ROLE_MEMBER } from "../../constants/roles";

const MENU_BY_ROLE = {
  [ROLE_ADMIN]: [
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { to: "/members", label: "Manage Members", icon: <FiUsers /> },
    { to: "/menu", label: "Manage Menus", icon: <FiClipboard /> },
    { to: "/ingredients", label: "Menu Ingredients", icon: <GiKnifeFork /> },
    { to: "/reservation", label: "Reservation", icon: <FiCalendar /> },
  ],
  [ROLE_MEMBER]: [
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { to: "/reservation/reserve", label: "Reserve Table", icon: <FiCalendar /> },
    { to: "/reservation/history", label: "Reservation History", icon: <FiClipboard /> },
  ],
};

function Sidebar({ role = ROLE_ADMIN, onLogout }) {
  const menuItems = MENU_BY_ROLE[role] || MENU_BY_ROLE[ROLE_ADMIN];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <p className="sidebar__brand-title">Esemka Foodcourt</p>
        <p className="sidebar__brand-subtitle">Management system</p>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__nav-item${isActive ? " sidebar__nav-item--active" : ""}`
            }
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__logout" onClick={onLogout}>
          <span className="sidebar__nav-icon">
            <FiLogOut />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;