import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMenu } from "react-icons/fi";
import { useSidebar } from "../../context/SidebarContext";

function Header({ title, subtitle, actions, showBack = false, backTo }) {
  const navigate = useNavigate();
  const { toggle } = useSidebar();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="header">
      <div className="header__heading">
        <button
          type="button"
          className="header__menu-toggle"
          onClick={toggle}
          aria-label="Buka menu"
        >
          <FiMenu />
        </button>
        {showBack && (
          <button
            type="button"
            className="header__back"
            onClick={handleBack}
            aria-label="Kembali"
          >
            <FiArrowLeft />
          </button>
        )}
        <div>
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="header__actions">{actions}</div>}
    </header>
  );
}

export default Header;
