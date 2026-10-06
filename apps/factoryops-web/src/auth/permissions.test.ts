import {
  AUTH_KEY,
  ROLE_KEY,
  canAccess,
  getRoleLabel,
  hasPermission,
  isAuthenticated,
  normalizeRole,
} from "./permissions";
import { beforeEach, describe, expect, it } from "vitest";

describe("permissions", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("normalizes supported role aliases", () => {
    expect(normalizeRole("Administrator")).toBe("admin");
    expect(normalizeRole("plant supervisor")).toBe("supervisor");
    expect(normalizeRole("field-operator")).toBe("operator");
    expect(normalizeRole("unknown")).toBe("operator");
  });

  it("keeps authentication and role state in session storage", () => {
    expect(isAuthenticated()).toBe(false);

    sessionStorage.setItem(AUTH_KEY, "true");
    sessionStorage.setItem(ROLE_KEY, "supervisor");

    expect(isAuthenticated()).toBe(true);
    expect(getRoleLabel()).toBe("Plant Supervisor");
    expect(hasPermission("create_machines")).toBe(true);
    expect(hasPermission("manage_users")).toBe(false);
  });

  it("limits operator navigation to the permissions it owns", () => {
    sessionStorage.setItem(ROLE_KEY, "operator");

    expect(canAccess("/dashboard")).toBe(true);
    expect(canAccess("/machines")).toBe(true);
    expect(canAccess("/maintenance")).toBe(true);
    expect(canAccess("/admin/users")).toBe(false);
    expect(canAccess("/scenes")).toBe(false);
    expect(hasPermission("record_maintenance")).toBe(true);
    expect(hasPermission("start_machines")).toBe(false);
  });

  it("grants administrative navigation only to administrators", () => {
    sessionStorage.setItem(ROLE_KEY, "admin");

    expect(canAccess("/admin/users")).toBe(true);
    expect(canAccess("/admin/factory")).toBe(true);
    expect(hasPermission("manage_roles")).toBe(true);
  });
});
