import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: () => {
      return null;
    },
    // ✅ Thêm action để cập nhật user
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    // ✅ Thêm action để chỉ cập nhật role
    updateUserRole: (state, action) => {
      if (state) {
        return { ...state, role: action.payload };
      }
      return state;
    },
  },
});

export const { login, logout, updateUser, updateUserRole } = userSlice.actions;
export default userSlice.reducer;
