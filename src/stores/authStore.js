import { create } from "zustand";
import axios from "axios";
import { API_BASE } from "../config/api.js";

function isUnreachableNetworkError(err) {
  return (
    !err?.response &&
    (err?.code === "ERR_NETWORK" ||
      err?.message === "Network Error" ||
      err?.message?.includes("CONNECTION_REFUSED"))
  );
}

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  /** Set when check-auth fails because the API is not reachable (e.g. server stopped). */
  connectionError: null,

  checkAuth: async () => {
    try {
      set({ loading: true, error: null, connectionError: null });
      const res = await axios.get(`${API_BASE}/common-api/check-auth`, {
        withCredentials: true,
      });
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
        connectionError: null,
      });
    } catch (err) {
      if (import.meta.env.DEV && isUnreachableNetworkError(err)) {
        console.info(
          "[auth] API unreachable — start the backend: cd backend && npm run dev",
        );
      }
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        connectionError: isUnreachableNetworkError(err)
          ? `Cannot reach the server at ${API_BASE}. Start the BlogApp backend (for example: cd backend && npm run dev) and ensure MongoDB is running so the API can listen on your PORT.`
          : null,
      });
    }
  },

  login: async (userCredWithRole) => {
    const { role, ...userCredObj } = userCredWithRole;
    try {
      set({ loading: true, error: null, connectionError: null });
      const res = await axios.post(
        `${API_BASE}/common-api/login`,
        userCredObj,
        { withCredentials: true },
      );
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
        connectionError: null,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
        connectionError: isUnreachableNetworkError(err)
          ? `Cannot reach the server at ${API_BASE}. Is the backend running?`
          : null,
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await axios.get(`${API_BASE}/common-api/logout`, { withCredentials: true });
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        connectionError: null,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },

  dismissConnectionError: () => set({ connectionError: null }),
}));
