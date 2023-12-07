import { generalDataActions } from "./generalData-slice";
import { formActions } from "./form-slice";

import {
  urlAccounts,
  urlEstates,
  urlJobs,
  urlRents,
  urlWorkers,
} from "../utils/endpoints.ts";

const fetchApi = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchAccounts = async () => {
  return await fetchApi(urlAccounts);
};

export const fetchEstates = async () => {
  return await fetchApi(urlEstates);
};

export const fetchJobs = async () => {
  return await fetchApi(urlJobs);
};

export const fetchRents = async () => {
  return await fetchApi(urlRents);
};

export const fetchWorkers = async () => {
  return await fetchApi(urlWorkers);
};
