import { UserProfile } from "@/components/Navbar";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLogin: boolean;
  user: any;
}

const initialState: AuthState = {
  isLogin: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<boolean>) => {
      console.log(action.payload, "user is login");
      state.isLogin = action.payload;
    },
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
  },
});

export const { setLogin, setUser } = authSlice.actions;
export const selectLogin = (state: { auth: AuthState }) => state.auth.isLogin;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
