import axios from "axios";
import { generalDataActions } from "./generalData-slice";
import { formActions } from "./form-slice";

import { urlEstates, urlJobs, urlRents, urlWorkers } from "../endpoints";

const fetchApi = async (url) => {
  try {
    const authToken = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "x-version": "1",
      },
    };

    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const fetchEstates = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlEstates + "/GetEstate");
      dispatch(generalDataActions.setEstates(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchJobs = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlJobs + "/GetJob");
      dispatch(generalDataActions.setJobs(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchRents = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlRents + "/GetRent");
      dispatch(generalDataActions.setRents(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchWorkers = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlWorkers + "/GetWorker");
      dispatch(generalDataActions.setWorkers(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};
