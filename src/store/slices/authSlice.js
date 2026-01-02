import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// ==========================
// Helpers
// ==========================
const getInitialAuthState = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      token: null,
      user: null,
      role: "guest",
      isAuthenticated: false,
    };
  }

  try {
    const decoded = jwtDecode(token);

    return {
      token,
      user: {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        isVerified: decoded.isVerified,
        isAdmin: decoded.isAdmin,
      },
      role: decoded.role,
      isAuthenticated: true,
    };
  } catch (error) {
    localStorage.removeItem("token");
    return {
      token: null,
      user: null,
      role: "guest",
      isAuthenticated: false,
    };
  }
};

// ==========================
// Initial State
// ==========================
const initialState = getInitialAuthState();

// ==========================
// Slice
// ==========================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const token = action.payload;

      const decoded = jwtDecode(token);

      state.token = token;
      state.user = {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        isVerified: decoded.isVerified,
        isAdmin: decoded.isAdmin,
      };
      state.role = decoded.role;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = "guest";
      state.isAuthenticated = false;

      localStorage.removeItem("token");
    },
    checkAuth: (state) => {
      if (!state.token) return;

      const decoded = jwtDecode(state.token);

      state.user = {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        isVerified: decoded.isVerified,
        isAdmin: decoded.isAdmin,
      };
      state.role = decoded.role;
      state.isAuthenticated = true;
    },

    updateUserFromToken: (state) => {
      if (!state.token) return;

      const decoded = jwtDecode(state.token);

      state.user = {
        _id: decoded._id,
        name: decoded.name,
        email: decoded.email,
        isVerified: decoded.isVerified,
        isAdmin: decoded.isAdmin,
      };
      state.role = decoded.role;
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateUserFromToken,
  checkAuth,
} = authSlice.actions;

export default authSlice.reducer;
