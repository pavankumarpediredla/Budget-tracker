import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../index";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD
    ? "https://budget-tracker-3miv.onrender.com/api"
    : "http://localhost:8081/api");

export type Transaction = {
  id: number;
  title: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
};

export type BudgetAllocation = {
  category: string;
  percentage: number;
  amount: number;
};

export type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  company: string;
  age: number;
  imageUrl: string;
  currencyCode: string;
};

export type BudgetPlanner = {
  monthlySalary: number;
  emergencyFundTarget: number;
  currencyCode: string;
  allocations: BudgetAllocation[];
};

export type GoalPlan = {
  id: number;
  title: string;
  targetAmount: number;
  savedAmount: number;
  monthsToTarget: number;
  recommendedMonthlySaving: number;
};

export type EmiTracker = {
  id: number;
  title: string;
  lender: string;
  monthlyEmi: number;
  monthsRemaining: number;
  startDate: string;
  endDate: string;
};

export type AiAdvice = {
  summary: string;
  suggestions: string[];
};

export type AnalyticsMetric = {
  label: string;
  amount: number;
  period: string;
};

export type ChartPoint = {
  label: string;
  amount: number;
};

export type CategorySpend = {
  category: string;
  amount: number;
};

export type BudgetAnalytics = {
  dailySpend: AnalyticsMetric;
  monthlySpend: AnalyticsMetric;
  yearlySpend: AnalyticsMetric;
  balanceInHand: AnalyticsMetric;
  weeklyTrend: ChartPoint[];
  monthlyTrend: ChartPoint[];
  categoryBreakdown: CategorySpend[];
};

type BudgetSummary = {
  monthlyBudget: number;
  monthlySpent: number;
  monthlyIncome: number;
  savings: number;
};

type BudgetDashboard = {
  summary: BudgetSummary;
  transactions: Transaction[];
  profile: UserProfile;
  planner: BudgetPlanner;
  goals: GoalPlan[];
  aiAdvice: AiAdvice;
  analytics: BudgetAnalytics;
  emiTrackers: EmiTracker[];
};

type BudgetState = BudgetDashboard & {
  status: "idle" | "loading" | "failed";
  error: string;
};

type CreateTransactionRequest = Omit<Transaction, "id">;
type ProfileRequest = UserProfile;
type BudgetPlannerRequest = {
  monthlySalary: number;
  emergencyFundTarget: number;
  currencyCode: string;
};
type GoalPlanRequest = {
  title: string;
  targetAmount: number;
  savedAmount: number;
  monthsToTarget: number;
};
type EmiTrackerRequest = Omit<EmiTracker, "id">;
type EmiSearchRequest = {
  month: string;
  fromDate: string;
  toDate: string;
};

const emptyProfile: UserProfile = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  occupation: "",
  company: "",
  age: 18,
  imageUrl: "",
  currencyCode: "INR",
};

const initialState: BudgetState = {
  summary: {
    monthlyBudget: 0,
    monthlySpent: 0,
    monthlyIncome: 0,
    savings: 0,
  },
  transactions: [],
  profile: emptyProfile,
  planner: {
    monthlySalary: 0,
    emergencyFundTarget: 0,
    currencyCode: "INR",
    allocations: [],
  },
  goals: [],
  aiAdvice: {
    summary: "",
    suggestions: [],
  },
  analytics: {
    dailySpend: { label: "", amount: 0, period: "" },
    monthlySpend: { label: "", amount: 0, period: "" },
    yearlySpend: { label: "", amount: 0, period: "" },
    balanceInHand: { label: "", amount: 0, period: "" },
    weeklyTrend: [],
    monthlyTrend: [],
    categoryBreakdown: [],
  },
  emiTrackers: [],
  status: "idle",
  error: "",
};

const defaultAnalytics: BudgetAnalytics = {
  dailySpend: { label: "", amount: 0, period: "" },
  monthlySpend: { label: "", amount: 0, period: "" },
  yearlySpend: { label: "", amount: 0, period: "" },
  balanceInHand: { label: "", amount: 0, period: "" },
  weeklyTrend: [],
  monthlyTrend: [],
  categoryBreakdown: [],
};

const getToken = (state: RootState) => state.auth.token;

const authorizedFetch = async (state: RootState, path: string, options?: RequestInit) => {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.headers ?? {}),
      Authorization: `Bearer ${getToken(state)}`,
    },
  });
};

export const fetchDashboard = createAsyncThunk(
  "budget/fetchDashboard",
  async (_, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/dashboard");
    const data = await response.json();

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to load dashboard.");
    }

    return data as BudgetDashboard;
  },
);

export const addTransaction = createAsyncThunk(
  "budget/addTransaction",
  async (payload: CreateTransactionRequest, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to save transaction.");
    }

    return data as BudgetDashboard;
  },
);

export const updateProfile = createAsyncThunk(
  "budget/updateProfile",
  async (payload: ProfileRequest, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to save profile.");
    }

    return data as BudgetDashboard;
  },
);

export const updatePlanner = createAsyncThunk(
  "budget/updatePlanner",
  async (payload: BudgetPlannerRequest, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/planner", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to save planner.");
    }

    return data as BudgetDashboard;
  },
);

export const addGoal = createAsyncThunk(
  "budget/addGoal",
  async (payload: GoalPlanRequest, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to save goal.");
    }

    return data as BudgetDashboard;
  },
);

export const requestAiAdvice = createAsyncThunk(
  "budget/requestAiAdvice",
  async (prompt: string, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();

    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to generate advice.");
    }

    return data as BudgetDashboard;
  },
);

export const addEmi = createAsyncThunk(
  "budget/addEmi",
  async (payload: EmiTrackerRequest, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/emi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to save EMI.");
    }
    return data as BudgetDashboard;
  },
);

export const updateEmi = createAsyncThunk(
  "budget/updateEmi",
  async ({ emiId, payload }: { emiId: number; payload: EmiTrackerRequest }, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, `/budget/emi/${emiId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to update EMI.");
    }
    return data as BudgetDashboard;
  },
);

export const searchEmi = createAsyncThunk(
  "budget/searchEmi",
  async (payload: EmiSearchRequest, thunkApi) => {
    const response = await authorizedFetch(thunkApi.getState() as RootState, "/budget/emi/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      return thunkApi.rejectWithValue(data.message ?? "Unable to search EMI.");
    }
    return data as BudgetDashboard;
  },
);

const applyDashboard = (state: BudgetState, payload: BudgetDashboard) => {
  state.summary = payload.summary;
  state.transactions = payload.transactions;
  state.profile = payload.profile;
  state.planner = payload.planner;
  state.goals = payload.goals;
  state.aiAdvice = payload.aiAdvice;
  state.analytics = payload.analytics ?? defaultAnalytics;
  state.emiTrackers = payload.emiTrackers ?? [];
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Unable to load dashboard.";
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(updatePlanner.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(requestAiAdvice.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(addEmi.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(updateEmi.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addCase(searchEmi.fulfilled, (state, action) => {
        state.error = "";
        applyDashboard(state, action.payload);
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("budget/") && action.type.endsWith("/rejected"),
        (state, action: { payload?: unknown }) => {
          state.error =
            typeof action.payload === "string" ? action.payload : "Budget request failed.";
        },
      );
  },
});

export default budgetSlice.reducer;
