import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    circuitDDLIsVisible: false,
    provinceDDLIsVisible: false,
    circuitNameIsVisible: false,
    currentStepsSubmitted: {
      step1: false,
      step2: false,
      step3: false,
    },
    stepperIsVisible: false,
    isToastShown: false,
    stepSummaryIsVisible: false,
  },
  reducers: {
    showCircuitDDL(state) {
      state.circuitDDLIsVisible = { status: true };
    },
    hideCircuitDDL(state) {
      state.circuitDDLIsVisible = { status: false };
    },
    showProvinceDDL(state) {
      state.provinceDDLIsVisible = { status: true };
    },
    hideProvinceDDL(state) {
      state.provinceDDLIsVisible = { status: false };
    },
    showCircuitName(state) {
      state.circuitNameIsVisible = { status: true };
    },
    hideCircuitName(state) {
      state.circuitNameIsVisible = { status: false };
    },
    setStepsSubmitted(state, action) {
      const { step, isSubmitted } = action.payload;
      state.currentStepsSubmitted[step] = isSubmitted;
    },
    setStepsSubmittedEmpty(state) {
      state.currentStepsSubmitted.step1 = false;
      state.currentStepsSubmitted.step2 = false;
      state.currentStepsSubmitted.step3 = false;
    },
    showStepper(state) {
      state.stepperIsVisible = true;
    },
    hideStepper(state) {
      state.stepperIsVisible = false;
    },
    showStepSummary(state) {
      state.stepSummaryIsVisible = true;
    },
    hideStepSummary(state) {
      state.stepSummaryIsVisible = false;
    },
    showToast(state) {
      state.isToastShown = true;
    },
  },
});

// incluyo acá mismo el Actions (porque son métodos simples)
export const uiActions = uiSlice.actions;

export default uiSlice;
