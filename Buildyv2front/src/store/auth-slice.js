import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  const isLoggedInData = JSON.parse(localStorage.getItem("isLoggedIn"));
  let isLoggedIn = false;

  if (isLoggedInData && new Date().getTime() < isLoggedInData.expiry) {
    isLoggedIn = isLoggedInData.value;
  } else {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userProvinceId");
    localStorage.removeItem("userMunicipalityId");
    localStorage.removeItem("userRoleNumber");
    localStorage.removeItem("userFullname");
    localStorage.removeItem("userId");
    localStorage.removeItem("isMobile");
  }

  return {
    isLoggedIn,
    userProvinceId: localStorage.getItem("userProvinceId") || "",
    userMunicipalityId: localStorage.getItem("userMunicipalityId") || "",
    userRoleNumber: localStorage.getItem("userRoleNumber") || "",
    userFullname: localStorage.getItem("userFullname") || "",
    userId: localStorage.getItem("userId") || "",
    isMobile: Boolean(localStorage.getItem("isMobile")) || false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login(state, action) {
      // const expiry = new Date().getTime() + 5 * 1000; // 1 hora
      const expiry = new Date().getTime() + 1 * 60 * 60 * 1000; // 1 hora
      state.isLoggedIn = true;
      state.userProvinceId = action.payload.userProvinceId;
      state.userMunicipalityId = action.payload.userMunicipalityId;
      state.userRoleNumber = action.payload.userRoleNumber;
      state.userFullname = action.payload.userFullname;
      state.userId = action.payload.userId;
      state.isMobile = action.payload.isMobile;

      const data = {
        value: true,
        expiry,
      };

      localStorage.setItem("isLoggedIn", JSON.stringify(data));
      localStorage.setItem("userProvinceId", state.userProvinceId);
      localStorage.setItem("userMunicipalityId", state.userMunicipalityId);
      localStorage.setItem("userRoleNumber", state.userRoleNumber);
      localStorage.setItem("userFullname", state.userFullname);
      localStorage.setItem("userId", state.userId);
      localStorage.setItem("isMobile", state.isMobile);
    },

    logout(state) {
      state.isLoggedIn = false;
      state.userProvinceId = "";
      state.userMunicipalityId = "";
      state.userRoleNumber = "";
      state.userFullname = "";
      state.userId = "";

      const data = {
        value: false,
        expiry: new Date().getTime(),
      };

      localStorage.setItem("isLoggedIn", JSON.stringify(data));
      localStorage.removeItem("userProvinceId");
      localStorage.removeItem("userMunicipalityId");
      localStorage.removeItem("userRoleNumber");
      localStorage.removeItem("userFullname");
      localStorage.removeItem("userId");
      localStorage.removeItem("isMobile");
    },

    setIsMobile(state, action) {
      state.isMobile = action.payload;
      localStorage.setItem("isMobile", action.payload);
    },

    initializeAuthState(state) {
      const isLoggedInData = JSON.parse(localStorage.getItem("isLoggedIn"));

      if (isLoggedInData && new Date().getTime() < isLoggedInData.expiry) {
        state.isLoggedIn = isLoggedInData.value;
      } else {
        localStorage.removeItem("isLoggedIn");
        state.isLoggedIn = false;
      }

      state.userRoleNumber = localStorage.getItem("userRoleNumber") || "";
      state.userFullname = localStorage.getItem("userFullname") || "";
      state.userId = localStorage.getItem("userId") || "";
      state.userProvinceId = localStorage.getItem("userProvinceId") || "";
      state.userMunicipalityId =
        localStorage.getItem("userMunicipalityId") || "";
      state.isMobile =
        localStorage.getItem("isMobile") == "true" ? true : false;
    },

    resetAuthState(state) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRoleNumber");
      localStorage.removeItem("userFullname");
      localStorage.removeItem("userId");
      localStorage.removeItem("userProvinceId");
      localStorage.removeItem("userMunicipalityId");
      localStorage.removeItem("isMobile");

      state.isLoggedIn = false;
      state.userRoleNumber = null;
      state.userFullname = null;
      state.userId = null;
      state.userProvinceId = null;
      state.userMunicipalityId = null;
      state.isMobile = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
