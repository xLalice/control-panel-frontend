import { login as loginApi, logout as logoutApi, me } from "@/api/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginSuccess } from "@/types";
import { User } from "@/types/sharedTypes";
import { RootState } from "../store";

/* ────────────  async thunks  ──────────── */
export const login = createAsyncThunk<
  LoginSuccess,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await loginApi(credentials);
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Login failed. Please try again.";
    return rejectWithValue(message);
  }
});


export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/me", async (_, thunkApi) => {
  try {
    return await me();
  } catch (err: any) {
    return thunkApi.rejectWithValue(
      err.response?.data?.message ?? "Fetching user failed"
    );
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, thunkApi) => {
    try {
      await logoutApi();
      return;
    } catch (err: any) {
      return thunkApi.rejectWithValue(
        err.response?.data?.message ?? "Logout failed"
      );
    }
  }
);

/* ────────────  slice  ──────────── */
export interface AuthState {
  isAuthenticated: boolean;
  authStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  user: User | null;
  isAuthInitialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  authStatus: "idle",
  error: null,
  isAuthInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* LOGIN */
    builder
      .addCase(login.pending, (state) => {
        state.authStatus = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isAuthInitialized = true;
        state.authStatus = "succeeded";
        state.isAuthenticated = true;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.authStatus = "failed";
        state.error = payload ?? "Unknown error";
      });

    /* FETCH ME */
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authStatus = "loading";
        state.isAuthInitialized = false;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.authStatus = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.authStatus = "failed";
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthInitialized = true; 
      });

    /* LOGOUT */
    builder
      .addCase(logout.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.authStatus = "idle";
        state.error = null;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.authStatus = "failed";
        state.error = payload ?? "Logout failed";
      });
  },
});

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoadingStatus = (state: RootState) => state.auth.authStatus;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUserHasPermission = (state: RootState, permission: string) =>
  (state.auth.user?.role?.permissions || []).includes(permission);

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
