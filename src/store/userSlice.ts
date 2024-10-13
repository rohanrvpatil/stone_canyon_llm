import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserData } from "../interfaces/userInterfaces.ts";

const initialState: UserData = {
  fullName: "",
  emailAddress: "",
  phoneNumber: "",
  zipCode: "",
  fullAddress: "",
  serviceId: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserData>) {
      state.fullName = action.payload.fullName;
      state.emailAddress = action.payload.emailAddress;
      state.phoneNumber = action.payload.phoneNumber;
      state.zipCode = action.payload.zipCode;
      state.fullAddress = action.payload.fullAddress;
      state.serviceId = action.payload.serviceId;
    },
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
