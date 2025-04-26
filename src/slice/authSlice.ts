// authSlice.ts
import { login as loginApi, logout as logoutApi, me } from "@/api/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginSuccess, User } from "@/types";
import { RootState } from "@/store";

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
      await logoutApi(); // session destroy on server
      return; // fulfilled with void payload
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
  role: string | null;
  permissions: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  permissions: [],
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
        state.role = payload.role;
        state.permissions = payload.permissions;
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
        state.role = payload.role.name;
        state.permissions = payload.role.permissions ?? [];
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
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload ?? "Logout failed";
      });
  },
});

export const selectCurrentUser = (state: RootState) => state.user;
export const selectUserRole = (state: RootState) => state.role;
export const selectUserPermissions = (state: RootState) => state.permissions;
export const selectAuthLoadingStatus = (state: RootState) => state.status;
export const selectAuthError = (state: RootState) => state.error;
export const selectIsAuthenticated = (state: RootState) =>
  state.isAuthenticated;

export default authSlice.reducer;
