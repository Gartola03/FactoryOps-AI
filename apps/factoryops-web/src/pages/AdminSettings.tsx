import { useEffect, useState, type FormEvent } from "react";
import {
  createAdminUser,
  getAdminUsers,
  getAdminRoles,
  getFactoryConfig,
  updateAdminUser,
  updateAdminRolePermissions,
  updateFactoryConfig,
  type AdminUser,
  type AdminUserInput,
  type AdminRole,
  type FactoryConfig,
} from "../api/client";
import "./AdminSettings.css";

type AdminSettingsProps = {
  initialTab: "users" | "factory";
};

type UserFormProps = {
  user: AdminUser | null;
  onCancel: () => void;
  onSaved: (user: AdminUser) => void;
};

const defaultConfig: FactoryConfig[] = [
  { key: "telemetry.temperature_critical", value: "90", updated_at: "" },
  { key: "telemetry.vibration_critical", value: "8", updated_at: "" },
  { key: "telemetry.pressure_critical", value: "120", updated_at: "" },
  { key: "services.kafka_broker", value: "", updated_at: "" },
  { key: "services.postgres_url", value: "", updated_at: "" },
  { key: "services.airflow_url", value: "", updated_at: "" },
  { key: "services.mlflow_url", value: "", updated_at: "" },
  { key: "factory.production_lines", value: "", updated_at: "" },
];

const permissionLabels: Record<string, string> = {
  view_machines: "View machines",
  read_machine: "Read machine data",
  update_machine: "Update machine data",
  create_machine: "Create machines",
  delete_machine: "Delete machines",
  view_telemetry: "View telemetry",
  view_alerts: "View alerts",
  view_predictions: "View predictions",
  view_maintenance_history: "View maintenance history",
  investigate_machines: "Investigate machines",
  use_copilot: "Use AI Copilot",
  record_maintenance: "Record maintenance",
  create_machines: "Create machines",
  update_machines: "Update machines",
  delete_machines: "Delete machines",
  start_machines: "Start machines",
  stop_machines: "Stop machines",
  pause_machines: "Pause machines",
  resume_machines: "Resume machines",
  run_scenarios: "Run scenarios",
  inject_failures: "Inject failures",
  reset_simulations: "Reset simulations",
  review_shift_logs: "Review shift reports",
  manage_users: "Manage users",
  manage_roles: "Manage roles",
  manage_factory_configuration: "Manage factory configuration",
};

function UserForm({ user, onCancel, onSaved }: UserFormProps) {
  const [form, setForm] = useState<AdminUserInput>({
    username: user?.username ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "operator",
    is_active: user?.is_active ?? true,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user && !form.password) {
      setError("A password is required for a new user.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = user
        ? await updateAdminUser(user.id, form)
        : await createAdminUser({ ...form, password: form.password || "" });
      onSaved(saved);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-user-form" onSubmit={handleSubmit}>
      <div className="admin-form-heading"><h2>{user ? "Edit user" : "Create user"}</h2><button type="button" onClick={onCancel}>Close</button></div>
      <div className="admin-form-grid">
        <label>Username<input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label>
        <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Password{user && <small>Leave blank to keep current password</small>}<input required={!user} type="password" minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AdminUser["role"] })}><option value="admin">ADMIN</option><option value="supervisor">SUPERVISOR</option><option value="operator">OPERATOR</option></select></label>
        <label className="admin-active-field"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Account active</label>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="admin-primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : user ? "Save changes" : "Create user"}</button>
    </form>
  );
}

function AdminSettings({ initialTab }: AdminSettingsProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<AdminRole["role"]>("supervisor");
  const [config, setConfig] = useState<FactoryConfig[]>(defaultConfig);
  const [editingUser, setEditingUser] = useState<AdminUser | null | undefined>(undefined);
  const [error, setError] = useState("");
  const [savingConfig, setSavingConfig] = useState(false);
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => {
    const loadData = initialTab === "users"
      ? Promise.all([getAdminUsers(), getAdminRoles()]).then(([loadedUsers, loadedRoles]) => {
        setUsers(loadedUsers);
        setRoles(loadedRoles);
      })
      : getFactoryConfig().then((loadedConfig) => {
        setConfig(defaultConfig.map((item) => loadedConfig.find((loaded) => loaded.key === item.key) || item));
      });

    loadData
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load administration data"));
  }, [initialTab]);

  function handleSavedUser(savedUser: AdminUser) {
    setUsers((current) => editingUser ? current.map((user) => user.id === savedUser.id ? savedUser : user) : [...current, savedUser]);
    setEditingUser(undefined);
  }

  const selectedRolePermissions = roles.find((role) => role.role === selectedRole)?.permissions ?? [];

  function togglePermission(permission: string) {
    setRoles((current) => current.map((role) => {
      if (role.role !== selectedRole) return role;
      const permissions = role.permissions.includes(permission)
        ? role.permissions.filter((item) => item !== permission)
        : [...role.permissions, permission];
      return { ...role, permissions };
    }));
  }

  async function saveRolePermissions() {
    setSavingRole(true);
    setError("");
    try {
      const saved = await updateAdminRolePermissions(selectedRole, selectedRolePermissions);
      setRoles((current) => current.map((role) => role.role === saved.role ? saved : role));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save role permissions");
    } finally {
      setSavingRole(false);
    }
  }

  async function saveConfig() {
    setSavingConfig(true);
    setError("");
    try {
      const saved = await Promise.all(config.map((item) => updateFactoryConfig(item.key, item.value)));
      setConfig(saved);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save factory configuration");
    } finally {
      setSavingConfig(false);
    }
  }

  return (
    <div className="admin-settings-page">
      <div className="page-heading">
        <div><p className="page-kicker">Platform administration</p><h1>{initialTab === "users" ? "User & Role Management" : "Factory Configuration"}</h1><p className="page-subtitle">{initialTab === "users" ? "Manage accounts and assign role permissions." : "Manage global factory and service parameters."}</p></div>
        <span className="admin-only-badge">ADMIN only</span>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {initialTab === "users" ? (
        <section className="admin-section">
          <div className="admin-section-heading"><div><p className="panel-label">Access control</p><h2>Users and roles</h2></div><button className="admin-primary-button" type="button" onClick={() => setEditingUser(null)}>Create user</button></div>
          {editingUser !== undefined && <UserForm user={editingUser} onCancel={() => setEditingUser(undefined)} onSaved={handleSavedUser} />}
          <div className="admin-user-table"><div className="admin-user-head"><span>User</span><span>Email</span><span>Role</span><span>Status</span><span>Last session</span><span>Actions</span></div>{users.map((user) => <div className="admin-user-row" key={user.id}><strong>{user.username}</strong><span>{user.email}</span><span className="admin-role">{user.role.toUpperCase()}</span><span className={user.is_active ? "admin-active" : "admin-inactive"}>{user.is_active ? "Active" : "Inactive"}</span><span>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never"}</span><button type="button" onClick={() => setEditingUser(user)}>Edit</button></div>)}</div>
          <div className="admin-permissions-panel"><div className="admin-section-heading"><div><p className="panel-label">Role capabilities</p><h2>Permissions by role</h2></div><div className="admin-role-controls"><select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value as AdminRole["role"])}><option value="admin">ADMIN</option><option value="supervisor">SUPERVISOR</option><option value="operator">OPERATOR</option></select><button className="admin-primary-button" type="button" onClick={saveRolePermissions} disabled={savingRole}>{savingRole ? "Saving..." : "Save permissions"}</button></div></div><div className="admin-permission-grid">{Object.entries(permissionLabels).map(([permission, label]) => <label key={permission}><input type="checkbox" checked={selectedRolePermissions.includes(permission)} onChange={() => togglePermission(permission)} />{label}</label>)}</div></div>
        </section>
      ) : (
        <section className="admin-section">
          <div className="admin-section-heading"><div><p className="panel-label">Factory platform</p><h2>Global configuration</h2></div><button className="admin-primary-button" type="button" onClick={saveConfig} disabled={savingConfig}>{savingConfig ? "Saving..." : "Save configuration"}</button></div>
          <div className="admin-config-grid">{config.map((item) => <label key={item.key}>{item.key.replaceAll("_", " ")}<input value={item.value} onChange={(event) => setConfig((current) => current.map((configItem) => configItem.key === item.key ? { ...configItem, value: event.target.value } : configItem))} /></label>)}</div>
        </section>
      )}
    </div>
  );
}

export default AdminSettings;
