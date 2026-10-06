import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMachines, login, recordMaintenance } from "./client";

describe("API client", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("logs in with JSON credentials and returns the API response", async () => {
    const response = {
      access_token: "token-123",
      token_type: "bearer",
      user: { id: 1, username: "operator", email: "operator@example.com", role: "operator" },
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(response), { status: 200 }),
    );

    await expect(login("operator@example.com", "secret")).resolves.toEqual(response);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "operator@example.com", password: "secret" }),
      }),
    );
  });

  it("sends the stored bearer token when reading machines", async () => {
    sessionStorage.setItem("factoryops-access-token", "token-123");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    await expect(getMachines()).resolves.toEqual([]);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/machines/",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-123",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("serializes maintenance input and exposes API error details", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "Permission required: record_maintenance" }), { status: 403 }),
    );

    await expect(recordMaintenance(7, "Inspect coupling")).rejects.toThrow(
      "Permission required: record_maintenance",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/machines/7/maintenance",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ description: "Inspect coupling" }),
      }),
    );
  });
});
