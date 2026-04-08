import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import budgetReducer from "./slices/budgetSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    budget: budgetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
