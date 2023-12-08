import { configureStore } from "@reduxjs/toolkit";
import changeState from "./oldStore.js";
import liveSettingsSlice from "./liveSettings-slice";
import generalDataSlice from "./generalData-slice";
import uiSlice from "./ui-slice";
import authSlice from "./auth-slice";
import formSlice from "./form-slice.js";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: {
    oldState: changeState,
    liveSettings: liveSettingsSlice.reducer,
    generalData: generalDataSlice.reducer,
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
    form: formSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
