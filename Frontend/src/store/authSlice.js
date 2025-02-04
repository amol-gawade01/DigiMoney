import { createSlice } from "@reduxjs/toolkit";

// Load state from localStorage if available
const initialState = {
  status: JSON.parse(localStorage.getItem("authStatus")) || false,
  user: JSON.parse(localStorage.getItem("user")) || null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.user = action.payload;
      localStorage.setItem("authStatus", JSON.stringify(true));
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
      localStorage.removeItem("authStatus");
      localStorage.removeItem("user");
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
