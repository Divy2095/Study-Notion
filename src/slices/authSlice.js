import { createSlice } from "@reduxjs/toolkit";


// Can make some issues in future 
const getInitialToken = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};

const initialState = {
  signupData: null,
  loading: false,
  token: getInitialToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
