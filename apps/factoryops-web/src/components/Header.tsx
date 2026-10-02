import { useNavigate } from "react-router-dom";
import { AUTH_KEY, ROLE_KEY, getRoleLabel } from "../auth/permissions";
import './Header.css'

function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem("factoryops-access-token");
    navigate("/login", { replace: true });
  }

  return (
    <header className="header">
      <div className="header-brand">
        <span className="header-mark">FO</span>
        <div>
          <p className="header-name">FactoryOps AI</p>
          <p className="header-context">Operations control center</p>
        </div>
      </div>
      <div className="header-actions">
        <span className="system-status"><span className="status-dot" />All systems nominal</span>
        <span className="header-role">{getRoleLabel()}</span>
        <button className="logout-button" type="button" onClick={handleLogout}>Exit</button>
      </div>
    </header>
  );
}

export default Header;