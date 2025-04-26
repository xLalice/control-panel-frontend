import { login as loginApi, logout as logoutApi, me } from "@/api/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User, LoginSuccess } from "@/types";
import { RootState } from "../store";

/* ────────────  async thunks  ──────────── */
export const login = createAsyncThunk<
  LoginSuccess,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, thunkApi) => {
  try {
    return await loginApi(credentials);
  } catch (err: any) {
    return thunkApi.rejectWithValue(
      err.response?.data?.message ?? "Login failed"
    );
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
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* LOGIN */
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = payload.user;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Unknown error";
      });

    /* FETCH ME */
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Unable to load user";
      });

    /* LOGOUT */
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Logout failed";
      });
  },
});

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoadingStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserHasPermission = (state: RootState, permission: string) =>
  (state.auth.user?.role?.permissions || []).includes(permission);

export default authSlice.reducer;