import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    circuitDDLIsVisible: false,
    provinceDDLIsVisible: false,
    TOTALVotosGLOBAL: 0,
    votosSlateTotalRedux: 0,
    votosPartyTotalRedux: 0,
    votosExtrasTotalRedux: 0,
  },
  reducers: {
    setTOTALVotosGLOBAL: (state, action) => {
      state.TOTALVotosGLOBAL = action.payload;
    },
    setVotosSlateTotalRedux: (state, action) => {
      state.votosSlateTotalRedux = action.payload;
    },
    setVotosPartyTotalRedux: (state, action) => {
      state.votosPartyTotalRedux = action.payload;
    },
    setVotosExtrasTotalRedux: (state, action) => {
      state.votosExtrasTotalRedux = action.payload;
    },
    emptyAllVotos: (state) => {
      state.votosSlateTotalRedux = 0;
      state.votosPartyTotalRedux = 0;
      state.votosExtrasTotalRedux = 0;
    },
    setAllVotos: (state, action) => {
      // state.votosSlateTotalRedux = action.payload.circuit;
      // state.votosPartyTotalRedux = action.payload;
      // state.votosExtrasTotalRedux = action.payload;
    },
  },
});

// incluyo acá mismo el Actions (porque son métodos simples)
export const formActions = formSlice.actions;

export default formSlice;
