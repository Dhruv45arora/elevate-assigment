const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/$/,
  "",
);

function getStoredTokens() {
  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");
  return { access, refresh };
}

export function setTokens(access, refresh) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("access_token"));
}

async function refreshAccessToken() {
  const { refresh } = getStoredTokens();
  if (!refresh) return null;

  const response = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}

async function authFetch(path, options = {}, retry = true) {
  const { access } = getStoredTokens();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (access) {
    headers.Authorization = `Bearer ${access}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retry) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      return authFetch(path, options, false);
    }
  }

  return response;
}

export async function register(username, password, email = "") {
  const response = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(formatApiError(data));
  }
  return data;
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Invalid username or password");
  }
  setTokens(data.access, data.refresh);
  return data;
}

export async function rewriteText(text, mode) {
  const response = await authFetch("/api/rewrite/", {
    method: "POST",
    body: JSON.stringify({ text, mode }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || formatApiError(data) || "Request failed");
  }
  return data;
}

function formatApiError(data) {
  if (typeof data === "string") return data;
  if (data.detail) return String(data.detail);
  const messages = [];
  for (const [field, errors] of Object.entries(data)) {
    if (Array.isArray(errors)) {
      messages.push(`${field}: ${errors.join(", ")}`);
    }
  }
  return messages.join(" ") || "Something went wrong";
}
