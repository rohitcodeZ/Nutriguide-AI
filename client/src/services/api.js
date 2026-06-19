import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Dynamic token fetching straight from local storage storage lines
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ng_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor: Safe recovery wrapper loop
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 💥 CRITICAL CHECK: Agar request login ya register route ki hai, toh session clear karke loop crash nahi karna hai!
    const isAuthRoute = err.config?.url?.includes("/auth/login") || err.config?.url?.includes("/auth/register");

    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("ng_token");
      
      // Window session bypass handling safely to secure dashboard crashes
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;