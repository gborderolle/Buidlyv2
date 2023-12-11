import { useState } from "react";
import axios from "axios";

const useAPI = () => {
  const [state, setState] = useState({
    isLoading: false,
    isSuccess: false,
    error: null,
    data: null,
  });

  const uploadData = async (dataToUpload, apiUrl) => {
    setState({ isLoading: true, isSuccess: false, error: null });

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(apiUrl, dataToUpload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-version": "1",
          "Content-Type": "application/json",
        },
      });

      setState({
        isLoading: false,
        isSuccess: true,
        error: null,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      let errorMessage = "Ocurrió un error desconocido";

      if (error.response) {
        if (typeof error.response.data === "object") {
          errorMessage = JSON.stringify(error.response.data, null, 2);
        } else {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Error en uploadData:", errorMessage);
      setState({ isLoading: false, isSuccess: false, error: errorMessage });
    }
  };

  return { ...state, uploadData };
};

export default useAPI;
