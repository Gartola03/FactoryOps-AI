import { NavLink } from "react-router-dom";
import { getRoleLabel, hasPermission, navigationItems } from "../auth/permissions";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar-label">Workspace</p>
      <nav className="sidebar-nav">
        {navigationItems.filter((link) => link.showInSidebar !== false && hasPermission(link.permission)).map((link) => (
          <NavLink key={link.path} to={link.path}>{link.label}</NavLink>
        ))}
      </nav>
      <div className="sidebar-footnote">
        <span className="sidebar-footnote-dot" />
        <p>{getRoleLabel()} access<br /><strong>Connected</strong></p>
      </div>
    </aside>
  );
}

export default Sidebar; 
