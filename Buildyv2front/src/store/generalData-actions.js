import axios from "axios";
import { generalDataActions } from "./generalData-slice";
import { formActions } from "./form-slice";

import {
  urlEstate,
  urlJob,
  urlRent,
  urlWorker,
  urlCity,
  urlProvince,
  urlCountry,
} from "../endpoints";

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

export const fetchEstateList = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlEstate + "/GetEstate");
      dispatch(generalDataActions.setEstateList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchJobList = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlJob + "/GetJob");
      dispatch(generalDataActions.setJobList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchRentList = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlRent + "/GetRent");
      dispatch(generalDataActions.setRentList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchWorkerList = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlWorker + "/GetWorker");
      dispatch(generalDataActions.setWorkerList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchCityList = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlCity + "/GetCity");
      dispatch(generalDataActions.setCityList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchProvinceList = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlProvince + "/GetProvince");
      dispatch(generalDataActions.setProvinceList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};

export const fetchCountryList = () => {
  return async (dispatch) => {
    try {
      const data = await fetchApi(urlCountry + "/GetCountry");
      dispatch(generalDataActions.setCountryList(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
};
