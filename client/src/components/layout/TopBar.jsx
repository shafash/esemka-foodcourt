import { FiSearch, FiBell } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { ROLE_ADMIN } from "../../constants/roles";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function TopBar() {
  const { user, role } = useAuth();

  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";
  const roleLabel = role === ROLE_ADMIN ? "Operations" : "Guest";

  return (
    <header className="topbar">
      <div className="topbar__search">
        <FiSearch aria-hidden="true" />
        <input type="search" placeholder="Search management portal..." />
      </div>

      <div className="topbar__actions">
        <button type="button" className="topbar__icon-button" aria-label="Notifikasi">
          <FiBell />
        </button>

        <div className="topbar__user">
          <div className="topbar__user-info">
            <span className="topbar__user-name">{fullName || "Guest"}</span>
            <span className="topbar__user-role">{roleLabel}</span>
          </div>
          <span className="topbar__avatar">{getInitials(fullName) || "U"}</span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
