const API_URL = "http://localhost:8000";

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