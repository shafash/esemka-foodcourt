import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function Header({ title, subtitle, actions, showBack = false, backTo }) {
  const navigate = useNavigate();

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
