import { createSlice } from "@reduxjs/toolkit";

const generalDataSlice = createSlice({
  name: "generalData",
  initialState: {
    partyList: [],
    provinceList: [],
    municipalityList: [],
    circuitList: [],
    slateList: [],
    candidateList: [],
    roleList: [],
    delegateList: [],
  },
  reducers: {
    setPartyList: (state, action) => {
      state.partyList = action.payload;
    },
    setProvinceList: (state, action) => {
      state.provinceList = action.payload;
    },
    setMunicipalityList: (state, action) => {
      state.municipalityList = action.payload;
    },
    setCircuitList: (state, action) => {
      state.circuitList = action.payload;
    },
    setSlateList: (state, action) => {
      state.slateList = action.payload;
    },
    setCandidateList: (state, action) => {
      state.candidateList = action.payload;
    },
    setRoleList: (state, action) => {
      state.roleList = action.payload;
    },
    setDelegateList: (state, action) => {
      state.delegateList = action.payload;
    },
  },
});

export const generalDataActions = generalDataSlice.actions;

export default generalDataSlice;
