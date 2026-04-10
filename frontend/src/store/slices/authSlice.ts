import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD
    ? "https://budget-tracker-3miv.onrender.com/api"
    : "http://localhost:8081/api");
const SIGNUP_EMAIL_KEY = "budget_signup_email";
const SIGNUP_OTP_HINT_KEY = "budget_signup_otp_hint";

type AuthState = {
  username: string;
  token: string;
  status: "idle" | "loading" | "failed";
  error: string;
  message: string;
};

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  username: string;
  token: string;
  message: string;
};

type SignupPayload = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  company: string;
  age: number;
  currencyCode: string;
};

type SignupResponse = {
  message: string;
  email: string;
  otpHint: string;
};

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

const initialState: AuthState = {
  username: sessionStorage.getItem("budget_username") ?? "",
  token: sessionStorage.getItem("budget_token") ?? "",
  status: "idle",
  error: "",
  message: "",
};

export const login = createAsyncThunk<LoginResponse, LoginPayload>(
  "auth/login",
  async (payload, thunkApi) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as LoginResponse & { message?: string };

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Login failed.");
    }

    return data;
  },
);

export const signup = createAsyncThunk<SignupResponse, SignupPayload>(
  "auth/signup",
  async (payload, thunkApi) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as SignupResponse & { message?: string };

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Signup failed.");
    }

    return data;
  },
);

export const verifyOtp = createAsyncThunk<LoginResponse, VerifyOtpPayload>(
  "auth/verifyOtp",
  async (payload, thunkApi) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as LoginResponse & { message?: string };

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "OTP verification failed.");
    }

    return data;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.username = "";
      state.token = "";
      state.status = "idle";
      state.error = "";
      state.message = "";
      sessionStorage.removeItem("budget_username");
      sessionStorage.removeItem("budget_token");
    },
    clearAuthFeedback(state) {
      state.error = "";
      state.message = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = "";
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.username = action.payload.username;
        state.token = action.payload.token;
        state.message = action.payload.message;
        sessionStorage.setItem("budget_username", action.payload.username);
        sessionStorage.setItem("budget_token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string" ? action.payload : "Login failed.";
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = "";
        state.message = "";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload.message;
        sessionStorage.setItem(SIGNUP_EMAIL_KEY, action.payload.email);
        sessionStorage.setItem(SIGNUP_OTP_HINT_KEY, action.payload.otpHint);
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string" ? action.payload : "Signup failed.";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = "";
        state.message = "";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload.message;
        sessionStorage.removeItem(SIGNUP_EMAIL_KEY);
        sessionStorage.removeItem(SIGNUP_OTP_HINT_KEY);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string" ? action.payload : "OTP verification failed.";
      });
  },
});

export const { logout, clearAuthFeedback } = authSlice.actions;
export const getPendingSignupEmail = () => sessionStorage.getItem(SIGNUP_EMAIL_KEY) ?? "";
export const getPendingOtpHint = () => sessionStorage.getItem(SIGNUP_OTP_HINT_KEY) ?? "";
export default authSlice.reducer;
