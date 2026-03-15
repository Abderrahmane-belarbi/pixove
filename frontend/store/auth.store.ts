import { User } from "@/types";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.67.124.79:5000";
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
  status: "loading" | "authenticated" | "unauthenticated";
  user: User | null | undefined;
  error: string | null;
  message: string | null;
  clearAuthFeedback: () => void;
  checkAuth: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<Auth>((set) => ({
  user: null,
  status: "unauthenticated",
  error: null,
  message: null,

  clearAuthFeedback: () => {
    set({ message: null, error: null });
  },
  checkAuth: async () => {
    set({
      status: "loading",
      error: null,
    });
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      set({ status: "unauthenticated" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        set({
          user: data.user,
          status: "authenticated",
        });
        return;
      }
      await SecureStore.deleteItemAsync("accessToken"); // we cant find the token then delete the storage of it (key: value)
      set({ user: null, status: "unauthenticated" });
    } catch (error) {
      set({ user: null, status: "unauthenticated" });
      console.log(error);
    }
  },
  googleSign: async () => {
    set({ status: "loading", error: null, message: null });
    try {
      window.location.href = `${API_URL}/google`;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: "Something went wrong" });
      }
    } finally {
      set({ status: "unauthenticated" });
    }
  },
  signup: async (email: string, password: string, name: string) => {
    set({ status: "loading", error: null, message: null });
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
        set({ message: data.message });
      } else {
        const errorMessage = data.error;
        set({ error: errorMessage });
        // for the frontend error to skip navigation to verify email
        throw new Error(errorMessage);
      }
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error instanceof Error) {
        errorMessage = error.message;
        set({ error: errorMessage });
      } else {
        set({ error: errorMessage });
      }
      // for the frontend error to skip navigation to verify email
      throw new Error(errorMessage);
    } finally {
      set({ status: "unauthenticated" });
    }
  },
  resendVerificationEmail: async (email: string) => {
    set({ status: "loading", error: null, message: null });
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
      set({ status: "unauthenticated" });
    }
  },
  verifyEmail: async (code: string, email: string) => {
    set({ status: "loading", error: null, message: null });
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
        set({
          status: "authenticated",
          message: data.message,
          user: data.user,
        });
      } else if (res.status === 410) {
        set({ status: "authenticated", message: data.message, error: null });
      } else {
        set({ error: data.message, status: "unauthenticated" });
        throw new Error(data.message);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, status: "unauthenticated" });
        throw new Error(error.message);
      }
    }
  },
  login: async (email: string, password: string) => {
    set({ status: "loading", error: null, message: null });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          status: "authenticated",
          error: null,
        });
        await SecureStore.setItemAsync("accessToken", data.accessToken);
      } else {
        const loginError = data.error;
        set({ error: loginError, status: "unauthenticated" });
        throw new Error(loginError);
      }
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, status: "unauthenticated" });
        throw new Error(error.message);
      }
    }
  },
  logout: async () => {
    set({ error: null, message: null, status: "loading" });
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
      });
      const data = await res.json();
      // TODO: deleting Refresh token from the database
      if (res.ok) {
        set({
          user: null,
          message: data.message,
          error: null,
        });
        await SecureStore.deleteItemAsync("accessToken");
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
      set({ status: "unauthenticated" });
    }
  },
  forgotPassword: async (email: string) => {
    set({ status: "loading", error: null, message: null });
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
      set({ status: "unauthenticated" });
    }
  },
  resetPassword: async (token: string, password: string) => {
    set({ status: "loading", error: null, message: null });
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
      set({ status: "unauthenticated" });
    }
  },
  updateProfile: async (input: any) => {
    set({ status: "loading", error: null, message: null });
    const token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      set({ status: "unauthenticated" });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        data.code === "AUTH_USER_NOT_FOUND" ||
        data.code === "AUTH_USER_UNAUTHORIZED"
          ? set({ status: "unauthenticated" })
          : set({ status: "authenticated" });
        set({ error: data.error });
        throw new Error(data.error);
      }
      set({ message: data.message, user: data.user, status: "authenticated" });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        throw error;
      }
    }
  },
}));
