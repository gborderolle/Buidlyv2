import { createSlice } from "@reduxjs/toolkit";

const generalDataSlice = createSlice({
  name: "generalData",
  initialState: {
    estates: [],
    jobs: [],
    rents: [],
    workers: [],
  },
  reducers: {
    setEstates: (state, action) => {
      state.estates = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setRents: (state, action) => {
      state.rents = action.payload;
    },
    setWorkers: (state, action) => {
      state.workers = action.payload;
    },
  },
});

export const generalDataActions = generalDataSlice.actions;

export default generalDataSlice;
