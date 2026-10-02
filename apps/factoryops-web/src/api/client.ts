const API_URL = "http://localhost:8000";
const TOKEN_KEY = "factoryops-access-token";

export type Machine = {
  id: number;
  machine_code: string;
  name: string;
  machine_type: string;
  status: string;
  factory_id: number | null;
  created_at: string;
  updated_at: string;
};

export type MachineDetail = {
  machine: Machine;
  telemetry: {
    temperature: number | null;
    vibration: number | null;
    rpm: number | null;
    failure_probability: number | null;
    alert_severity: string | null;
    scenario: string | null;
    recorded_at: string;
  } | null;
  maintenance_history: {
    id: number;
    description: string;
    status: string;
    created_at: string;
    verified_at: string | null;
  }[];
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string | null;
  };
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Cannot reach the API. Start it with: make api");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "Unable to sign in");
  }

  return response.json();
}

export async function getHealth() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3000);

  const response = await fetch(
    `${API_URL}/api/v1/health`,
    { signal: controller.signal }
  );
  window.clearTimeout(timeout);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || "API request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getMachines() {
  return apiRequest<Machine[]>("/api/v1/machines/");
}

export function getMachineDetail(machineId: number) {
  return apiRequest<MachineDetail>(`/api/v1/machines/${machineId}/detail`);
}

export type MachineInput = {
  machine_code: string;
  name: string;
  machine_type: string;
  factory_id: number | null;
};

export function createMachine(machine: MachineInput) {
  return apiRequest<Machine>("/api/v1/machines/", {
    method: "POST",
    body: JSON.stringify(machine),
  });
}

export function updateMachine(machineId: number, machine: MachineInput) {
  return apiRequest<Machine>(`/api/v1/machines/${machineId}`, {
    method: "PUT",
    body: JSON.stringify(machine),
  });
}

export function deleteMachine(machineId: number) {
  return apiRequest<void>(`/api/v1/machines/${machineId}`, { method: "DELETE" });
}

export function recordMaintenance(machineId: number, description: string) {
  return apiRequest<{ id: number; machine_id: number; description: string; status: string; created_at: string }>(
    `/api/v1/machines/${machineId}/maintenance`,
    {
      method: "POST",
      body: JSON.stringify({ description }),
    },
  );
}

export type ShiftReport = {
  id: number;
  machine_code: string;
  description: string;
  status: string;
  created_at: string;
  verified_at: string | null;
};

export function getShiftReports() {
  return apiRequest<ShiftReport[]>("/api/v1/machines/shift-reports");
}

export function verifyShiftReport(reportId: number) {
  return apiRequest<{ id: number; status: string; verified_at: string }>(
    `/api/v1/machines/shift-reports/${reportId}/verify`,
    { method: "PATCH" },
  );
}

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "supervisor" | "operator";
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
};

export type AdminUserInput = {
  username: string;
  email: string;
  password?: string;
  role: AdminUser["role"];
  is_active: boolean;
};

export type FactoryConfig = {
  key: string;
  value: string;
  updated_at: string;
};

export function getAdminUsers() {
  return apiRequest<AdminUser[]>("/api/v1/admin/users");
}

export function createAdminUser(user: Required<AdminUserInput>) {
  return apiRequest<AdminUser>("/api/v1/admin/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function updateAdminUser(userId: number, user: AdminUserInput) {
  return apiRequest<AdminUser>(`/api/v1/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

export type AdminRole = {
  role: "admin" | "supervisor" | "operator";
  permissions: string[];
};

export function getAdminRoles() {
  return apiRequest<AdminRole[]>("/api/v1/admin/roles");
}

export function updateAdminRolePermissions(role: AdminRole["role"], permissions: string[]) {
  return apiRequest<AdminRole>(`/api/v1/admin/roles/${role}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissions }),
  });
}

export function getFactoryConfig() {
  return apiRequest<FactoryConfig[]>("/api/v1/admin/factory");
}

export function updateFactoryConfig(key: string, value: string) {
  return apiRequest<FactoryConfig>(`/api/v1/admin/factory/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
  });
}