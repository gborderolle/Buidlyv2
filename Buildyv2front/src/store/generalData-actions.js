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
      dispatch(generalDataActions.setEstateList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchJobs = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlJobs + "/GetJob");
      dispatch(generalDataActions.setJobList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchRents = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlRents + "/GetRent");
      dispatch(generalDataActions.setRentList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchWorkers = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlWorkers + "/GetWorker");
      dispatch(generalDataActions.setWorkerList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};
