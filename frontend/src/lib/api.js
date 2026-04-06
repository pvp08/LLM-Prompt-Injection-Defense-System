import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const analysisApi = {
  analyze: (data) => api.post("/analyze", data),
  getSampleAttacks: () => api.get("/sample-attacks"),
};

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
};

export const logsApi = {
  getLogs: (params) => api.get("/logs", { params }),
  getLog: (id) => api.get(`/logs/${id}`),
};

export const systemApi = {
  getStatus: () => api.get("/system/status"),
};

export default api;
