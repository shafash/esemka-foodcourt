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

function Sidebar({ role = ROLE_ADMIN, onLogout }) {
  const sections = NAV_SECTIONS_BY_ROLE[role] || NAV_SECTIONS_BY_ROLE[ROLE_ADMIN];

  return (
    <aside className="sidebar">
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
