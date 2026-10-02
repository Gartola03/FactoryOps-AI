export const AUTH_KEY = "factoryops-authenticated";
export const ROLE_KEY = "factoryops-user-role";

export type UserRole = "admin" | "supervisor" | "operator";
export type Permission =
  | "view_machines"
  | "view_telemetry"
  | "view_alerts"
  | "view_predictions"
  | "view_maintenance_history"
  | "investigate_machines"
  | "use_copilot"
  | "record_maintenance"
  | "create_machines"
  | "update_machines"
  | "delete_machines"
  | "start_machines"
  | "stop_machines"
  | "pause_machines"
  | "resume_machines"
  | "run_scenarios"
  | "inject_failures"
  | "reset_simulations"
  | "review_shift_logs"
  | "manage_users"
  | "manage_roles"
  | "manage_factory_configuration";

export type NavigationItem = {
  path: string;
  number: string;
  label: string;
  permission: Permission;
  showInSidebar?: boolean;
};

const operatorPermissions: Permission[] = [
    "view_machines", "view_telemetry", "view_alerts", "view_predictions",
    "view_maintenance_history", "investigate_machines", "use_copilot", "record_maintenance",
];

const rolePermissions: Record<UserRole, Permission[]> = {
  operator: operatorPermissions,
  supervisor: [
    ...operatorPermissions,
    "view_machines", "create_machines", "update_machines", "delete_machines", "start_machines", "stop_machines",
    "pause_machines", "resume_machines", "run_scenarios", "inject_failures",
    "reset_simulations", "review_shift_logs",
  ],
  admin: [
    "manage_users", "manage_roles", "manage_factory_configuration",
    "view_machines", "create_machines", "update_machines", "delete_machines", "start_machines", "stop_machines",
    "pause_machines", "resume_machines", "run_scenarios", "inject_failures",
    "reset_simulations", "review_shift_logs", "view_telemetry", "view_alerts",
    "view_predictions", "view_maintenance_history", "investigate_machines",
    "use_copilot", "record_maintenance",
  ],
};

export const navigationItems: NavigationItem[] = [
  { path: "/dashboard", number: "01", label: "Dashboard", permission: "view_machines" },
  { path: "/machines", number: "02", label: "Machines", permission: "view_machines" },
  { path: "/telemetry", number: "03", label: "Telemetry", permission: "view_telemetry", showInSidebar: false },
  { path: "/alerts", number: "04", label: "Alerts", permission: "view_alerts", showInSidebar: false },
  { path: "/predictions", number: "05", label: "Predictions", permission: "view_predictions", showInSidebar: false },
  { path: "/maintenance", number: "06", label: "Maintenance", permission: "view_maintenance_history", showInSidebar: false },
  { path: "/investigations", number: "07", label: "Investigations", permission: "investigate_machines", showInSidebar: false },
  { path: "/copilot", number: "08", label: "AI Copilot", permission: "use_copilot" },
  { path: "/scenes", number: "09", label: "Scenarios", permission: "run_scenarios", showInSidebar: true },
  { path: "/shift-logs", number: "10", label: "Shift reports", permission: "review_shift_logs", showInSidebar: true },
  { path: "/admin/users", number: "11", label: "Users & Roles", permission: "manage_users" },
  { path: "/admin/roles", number: "12", label: "Roles", permission: "manage_roles", showInSidebar: false },
  { path: "/admin/factory", number: "13", label: "Factory config", permission: "manage_factory_configuration" },
];

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function normalizeRole(role: string | null | undefined): UserRole {
  const normalizedRole = role?.trim().toLowerCase().replace(/[-\s]+/g, "_");

  if (normalizedRole === "admin" || normalizedRole === "administrator") {
    return "admin";
  }

  if (normalizedRole === "supervisor" || normalizedRole === "plant_supervisor" || normalizedRole === "manager") {
    return "supervisor";
  }

  if (normalizedRole === "operator" || normalizedRole === "field_operator" || normalizedRole === "technician") {
    return "operator";
  }

  return "operator";
}

export function getUserRole(): UserRole {
  return normalizeRole(sessionStorage.getItem(ROLE_KEY));
}

export function hasPermission(permission: Permission) {
  return rolePermissions[getUserRole()].includes(permission);
}

export function canAccess(path: string) {
  const item = navigationItems.find((navigationItem) => navigationItem.path === path);
  return item ? hasPermission(item.permission) : path === "/dashboard";
}

export function getDefaultRoute() {
  return "/dashboard";
}

export function getRoleLabel() {
  const role = getUserRole();
  return { admin: "Administrator", supervisor: "Plant Supervisor", operator: "Field Operator" }[role];
}