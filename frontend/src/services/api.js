function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, ""); // strip any trailing slash(es)
}

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
);

export const getToken = () => localStorage.getItem("anviaToken");

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Ensure exactly one slash between base and path, regardless of
  // whether `path` was passed with or without a leading slash.
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getUploadUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replaceAll("\\", "/").replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
}
