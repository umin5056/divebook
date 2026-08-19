import axios from "axios";
import { API_BASE_URL } from "../constants/env";

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthEndpoint = config?.url?.startsWith("/api/auth/");
    const isAuthError = response?.status === 401 || response?.status === 403;

    if (isAuthEndpoint || !isAuthError || config._retry) {
      if (isAuthError && !isAuthEndpoint) {
        logout();
      }
      return Promise.reject(error);
    }

    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      logout();
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      refreshPromise ??= axios
        .post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken: storedRefreshToken,
        })
        .finally(() => {
          refreshPromise = null;
        });

      const { data } = await refreshPromise;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      config.headers.Authorization = `Bearer ${data.accessToken}`;
      return client(config);
    } catch (refreshError) {
      logout();
      return Promise.reject(refreshError);
    }
  }
);

export default client;
