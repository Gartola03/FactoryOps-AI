import { getRoleLabel, hasPermission, navigationItems, type Permission } from "../auth/permissions";
import "./RoleScreen.css";

type RoleScreenProps = {
  path: string;
  title: string;
  description: string;
};

const actionsByPath: Record<string, { label: string; permission: Permission }[]> = {
  "/maintenance": [{ label: "Record maintenance", permission: "record_maintenance" }],
  "/machines": [{ label: "Create machine", permission: "create_machines" }],
  "/scenes": [
    { label: "Start machine", permission: "start_machines" },
    { label: "Stop machine", permission: "stop_machines" },
    { label: "Pause machine", permission: "pause_machines" },
    { label: "Resume machine", permission: "resume_machines" },
    { label: "Run pre-built scenario", permission: "run_scenarios" },
    { label: "Inject failure", permission: "inject_failures" },
    { label: "Reset simulation", permission: "reset_simulations" },
  ],
  "/shift-logs": [{ label: "Verify operator repair", permission: "review_shift_logs" }],
};

function RoleScreen({ path, title, description }: RoleScreenProps) {
  const actions = (actionsByPath[path] ?? []).filter((action) => hasPermission(action.permission));
  const related = navigationItems.filter((item) => item.path !== path && hasPermission(item.permission)).slice(0, 3);

  return (
    <div className="role-screen">
      <div className="page-heading">
        <div>
          <p className="page-kicker">{getRoleLabel()} workspace</p>
          <h1>{title}</h1>
          <p className="page-subtitle">{description}</p>
        </div>
        <span className="role-screen-badge">Frontend access</span>
      </div>

      <section className="role-screen-grid" aria-label={`${title} options`}>
        <article className="role-screen-panel">
          <p className="panel-label">Available options</p>
          <h2>What you can do here</h2>
          <div className="role-screen-actions">
            {actions.length > 0 ? actions.map((action) => (
              <button key={action.label} type="button" className="role-screen-action">{action.label}<span aria-hidden="true">-&gt;</span></button>
            )) : <p className="role-screen-empty">This view is ready for the connected backend workflow.</p>}
          </div>
        </article>
        <article className="role-screen-panel role-screen-context">
          <p className="panel-label">Your access</p>
          <h2>{getRoleLabel()}</h2>
          <p>Navigation and available actions are filtered by the current frontend role.</p>
          <div className="role-screen-related">
            {related.map((item) => <span key={item.path}>{item.label}</span>)}
          </div>
        </article>
      </section>
    </div>
  );
}

export default RoleScreen;