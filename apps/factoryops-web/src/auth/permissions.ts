export const AUTH_KEY = "factoryops-authenticated";
export const ROLE_KEY = "factoryops-user-role";

export type UserRole = "admin" | "manager" | "user";

const roleAccess: Record<UserRole, string[]> = {
  admin: ["/dashboard", "/machines", "/scenes", "/events", "/settings"],
  manager: ["/dashboard", "/machines"],
  user: ["/dashboard", "/machines"],
};

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function getUserRole(): UserRole {
  const role = sessionStorage.getItem(ROLE_KEY);

  if (role === "admin" || role === "manager" || role === "user") {
    return role;
  }

  return "user";
}

export function canAccess(path: string) {
  return roleAccess[getUserRole()].includes(path);
}

export function getDefaultRoute() {
  return "/dashboard";
}

export function getRoleLabel() {
  const role = getUserRole();
  return role.charAt(0).toUpperCase() + role.slice(1);
}