import { NavLink } from "react-router-dom";
import { canAccess, getRoleLabel } from "../auth/permissions";
import "./Sidebar.css";

function Sidebar() {
  const links = [
    { path: "/dashboard", number: "01", label: "Dashboard" },
    { path: "/machines", number: "02", label: "Machines" },
    { path: "/scenes", number: "03", label: "Scenes" },
    { path: "/events", number: "04", label: "Events" },
    { path: "/settings", number: "05", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <p className="sidebar-label">Workspace</p>
      <nav className="sidebar-nav">
        {links.filter((link) => canAccess(link.path)).map((link) => (
          <NavLink key={link.path} to={link.path}><span>{link.number}</span>{link.label}</NavLink>
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
