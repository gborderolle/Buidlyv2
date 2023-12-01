import { createSlice } from "@reduxjs/toolkit";

const liveSettingsSlice = createSlice({
  name: "liveSettings",
  initialState: {
    circuit: null,
    circuitPushId: 0,
    circuitId: 0,
    circuitName: "",
    circuitPopulation: 0,
    circuitVotes: 0,
    //
    province: null,
    provinceId: 0,
    provincePushId: 0,
    provinceName: "",
    provinceCenter: "",
    provinceZoom: 13, // o 12 mvd
    //
  },
  reducers: {
    setSelectedCircuit: (state, action) => {
      if (action.payload === null) {
        // Restablece todas las propiedades relacionadas con el circuito a sus valores predeterminados
        state.circuit = null;
        state.circuitPushId = 0; // Asume que 0 es un valor predeterminado válido
        state.circuitId = 0;
        state.circuitName = "";
        state.circuitPopulation = 0;
        state.circuitVotes = 0;
        // Si tienes más propiedades relacionadas con el circuito, también deberías restablecerlas aquí
      } else {
        // Asigna los valores de la acción a las propiedades del estado
        state.circuit = action.payload;
        state.circuitPushId = action.payload.pushId;
        state.circuitId = action.payload.circuitId;
        state.circuitName = action.payload.circuitName;
        state.circuitPopulation = action.payload.circuitPopulation;
        state.circuitVotes = action.payload.circuitVotes;
        // Asigna valores a cualquier otra propiedad que pueda estar en el payload
      }
    },

    setSlateVotesList: (state, action) => {
      if (state.circuit && action.payload) {
        state.circuit.slateVotesList = action.payload;
      }
    },

    setPartyVotesList: (state, action) => {
      if (state.circuit && action.payload) {
        state.circuit.partyVotesList = action.payload;
      }
    },

    setStepCompletedCircuit: (state, action) => {
      // Asumiendo que 'step' es el número del paso que llega por parámetro (e.g., 'step1completed')
      const stepKey = `step${action.payload}completed`;

      // Verifica si el estado actual tiene la clave que corresponde al paso.
      if (
        state.circuit &&
        Object.prototype.hasOwnProperty.call(state.circuit, stepKey)
      ) {
        state.circuit[stepKey] = true;
      }
    },

    setSelectedProvince: (state, action) => {
      state.province = action.payload;
      state.provincePushId = action.payload.pushId;
      state.provinceId = action.payload.provinceId;
      state.provinceName = action.payload.provinceName;
      state.provinceCenter = action.payload.provinceCenter;
      state.provinceZoom = action.payload.provinceZoom;
    },
  },
});

export const liveSettingsActions = liveSettingsSlice.actions;

export default liveSettingsSlice;
