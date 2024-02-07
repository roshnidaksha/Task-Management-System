import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import userReducer from "./slices/userSlice.ts";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;