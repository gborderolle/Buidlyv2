import { generalDataActions } from "./generalData-slice";
import { formActions } from "./form-slice";

import {
  urlContracts,
  urlEstates,
  urlJobs,
  urlNotaries,
  urlOwners,
  urlPurchases,
  urlRents,
  urlWarrants,
  urlWorkers,
  // Importa las demás URLs aquí
} from "./endpoints";

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

export const fetchContracts = async () => {
  return await fetchApi(urlContracts);
  //dispatch(generalDataActions.setMunicipalityList(dataArray));
};

export const fetchEstates = async () => {
  return await fetchApi(urlEstates);
};

export const fetchJobs = async () => {
  return await fetchApi(urlJobs);
};

export const fetchNotaries = async () => {
  return await fetchApi(urlNotaries);
};

export const fetchOwners = async () => {
  return await fetchApi(urlOwners);
};

export const fetchPurchases = async () => {
  return await fetchApi(urlPurchases);
};

export const fetchRents = async () => {
  return await fetchApi(urlRents);
};

export const fetchWarrants = async () => {
  return await fetchApi(urlWarrants);
};

export const fetchWorkers = async () => {
  return await fetchApi(urlWorkers);
};
