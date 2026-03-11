import { User } from "@/types";
import { Platform } from "react-native";
import { create } from "zustand";
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android"
    ? "http://192.168.1.8:5000"
    : "http://localhost:5000");

const API_URL = `${API_BASE_URL}/api/auth`;

const REQUEST_TIMEOUT_MS = 15000;

async function fetchWithTimeout(
  url: string,
  options = {},
  timeoutMs = REQUEST_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

interface Auth {
  user: User | null | undefined;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

export const useAuth = create<Auth>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: false,
  message: null,

  clearAuthFeedback: () => {
    set({ message: null, error: null });
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, isAuthenticated: false, error: null });
    try {
      const res = await fetch(`${API_URL}/check-auth`, {
        credentials: "include", // critical for cookie-based auth across frontend/backend origins
        // we need it:
        // when browser must accept Set-Cookie from backend response like /verify-email, /login
        // browser must send existing cookie to backend like /check-auth, /logout or any protected routes
      });
      const data = await res.json();
      if (res.ok) {
        set({ user: data.user, isAuthenticated: true });
        return;
      }
      set({ user: null });
    } catch (error) {
      set({ user: null });
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  googleSign: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      window.location.href = `${API_URL}/google`;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: "Something went wrong" });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await fetchWithTimeout(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        set({
          message: data.message,
        });
      } else {
        const errorMessage = data?.message || "Error signing up";
        set({
          error: errorMessage,
        });
        // for the frontend error to skip navigation to verify email
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.log("error:", error);
      let errorMessage = "Something went wrong";
      if (error instanceof Error) {
        set({ error: error.message });
        errorMessage =
          error.name === "AbortError" ? error.message : "Error signing up";
        set({ error: errorMessage });
      } else {
        set({ error: errorMessage });
      }

      // for the frontend error to skip navigation to verify email
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  resendVerificationEmail: async (email: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      if (!email) {
        const noEmailError =
          "No verification request found. Please start the signup process.";
        set({ error: noEmailError });
        throw new Error(noEmailError);
      }
      const res = await fetch(`${API_URL}/resend-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        set({ message: data.message });
      } else {
        const errorMessage =
          data?.message || "Unable to resend verification email";
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error instanceof Error) {
        errorMessage = error.message || "Unable to resend verification email";
        set({ error: errorMessage });
      } else {
        set({ error: errorMessage });
      }
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  verifyEmail: async (code: string, email: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      if (!email) {
        const noEmailError =
          "No verification request found. Please start the signup process.";
        set({ error: noEmailError });
        throw new Error(noEmailError);
      }
      const res = await fetch(`${API_URL}/verify-email`, {
        credentials: "include", // critical for cookie-based auth across frontend/backend origins
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, email }),
        // we need it:
        // when browser must accept Set-Cookie from backend response like /verify-email, /login
        // browser must send existing cookie to backend like /check-auth, /logout or any protected routes
      });
      const data = await res.json();
      if (res.ok) {
        set({ isAuthenticated: true, message: data.message, user: data.user });
      } else if (res.status === 410) {
        set({ isAuthenticated: true, message: data.message, error: null });
      } else {
        set({ error: data.message, isAuthenticated: false });
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isAuthenticated: false });
        throw new Error(error.message);
      }
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // critical for cookie-based auth across frontend/backend origins
        // we need it:
        // when browser must accept Set-Cookie from backend response like /verify-email, /login
        // browser must send existing cookie to backend like /check-auth, /logout or any protected routes
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        set({
          user: data.user,
          message: data.message,
          isAuthenticated: true,
          error: null,
        });
      } else {
        const loginError = data.error;
        set({ error: loginError });
        throw new Error(loginError);
      }
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        throw new Error(error.message);
      }
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include", // critical for cookie-based auth across frontend/backend origins
        // we need it:
        // when browser must accept Set-Cookie from backend response like /verify-email, /login
        // browser must send existing cookie to backend like /check-auth, /logout or any protected routes
      });
      const data = await res.json();
      if (res.ok) {
        set({
          user: null,
          message: data.message,
          isAuthenticated: false,
          error: null,
        });
      } else {
        const logoutError = data.error;
        set({ error: logoutError });
        throw new Error(logoutError);
      }
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        throw new Error(error.message);
      }
    } finally {
      set({ isLoading: false });
    }
  },
  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        set({ message: data.message });
        return;
      }
      throw new Error(data.error);
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },
  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        set({ message: data.message });
        return;
      }
      throw new Error(data.error);
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },
  updateProfile: async (input: any) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await fetch(`${API_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ error: data.error });
        throw new Error(data.error);
      }
      set({ message: data.message, user: data.user });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
