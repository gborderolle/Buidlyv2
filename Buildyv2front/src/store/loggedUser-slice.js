import { createSlice } from "@reduxjs/toolkit";

// Función para inicializar el estado desde localStorage
const getInitialState = () => {
  return {
    myPartyId: localStorage.getItem("myPartyId") || 0,
    myPartyName: localStorage.getItem("myPartyName") || "",
    myPartyImageURL: localStorage.getItem("myPartyImageURL") || "",
    myPartyColor: localStorage.getItem("myPartyColor") || "",
    userName: localStorage.getItem("userName") || "",
    provinceId: localStorage.getItem("userProvinceId") || 0,
    municipalityId: localStorage.getItem("userMunicipalityId") || 0,
    userRoleNumber: localStorage.getItem("userRoleNumber") || 0,
    userFullname: localStorage.getItem("userFullname") || "",
  };
};

const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState: getInitialState(),
  reducers: {
    setMyParty: (state, action) => {
      state.myPartyId = action.payload.myPartyId;
      state.myPartyName = action.payload.myPartyName;
      state.myPartyImageURL = action.payload.myPartyImageURL;
      state.myPartyColor = action.payload.myPartyColor;
      state.userName = action.payload.userName;
      state.municipalityId = action.payload.municipalityId;
      state.provinceId = action.payload.provinceId;
    },

    setUserRole: (state, action) => {
      state.userRoleNumber = action.payload;
    },

    setProvince: (state, action) => {
      state.provinceId = action.payload;
    },

    setMunicipality: (state, action) => {
      state.municipalityId = action.payload;
    },

    setUserFullname: (state, action) => {
      state.fullname = action.payload;
    },
  },
});

export const loggedUserActions = loggedUserSlice.actions;

export default loggedUserSlice;
