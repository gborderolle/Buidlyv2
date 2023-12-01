import { configureStore } from "@reduxjs/toolkit";
import changeState from "./oldStore.js";
import liveSettingsSlice from "./liveSettings-slice";
import loggedUserSlice from "./loggedUser-slice";
import generalDataSlice from "./generalData-slice";
import uiSlice from "./ui-slice";
import authSlice from "./auth-slice";
import formSlice from "./form-slice.js";
// import formSlice from "./form-slice";

const store = configureStore({
  reducer: {
    oldState: changeState,
    liveSettings: liveSettingsSlice.reducer,
    loggedUser: loggedUserSlice.reducer,
    generalData: generalDataSlice.reducer,
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
    form: formSlice.reducer,
  },
});

export default store;
