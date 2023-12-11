import { useState } from "react";

const useFirebase = (config = { method: "POST" }) => {
  const [state, setState] = useState({
    isLoading: false,
    isSuccess: false,
    error: null,
    data: null,
  });

  const uploadData = async (
    dataToUpload,
    firebaseUrlFinal,
    firebaseUrlClean
  ) => {
    try {
      setState({ isLoading: true, isSuccess: false, error: null });

      const response = await fetch(firebaseUrlFinal, {
        ...config,
        body: JSON.stringify(dataToUpload),
      });

      if (!response.ok) {
        throw new Error("Algo salió mal");
      }

      const responseData = await response.json();
      const pushId = responseData.name;

      if (firebaseUrlClean) {
        const patchUrl = `${firebaseUrlClean}/${pushId}.json`;
        await fetch(patchUrl, {
          method: "PATCH",
          body: JSON.stringify({ pushId }),
        });
      }

      const updatedData = {
        ...dataToUpload,
        pushId: pushId,
      };

      setState({
        isLoading: false,
        isSuccess: true,
        error: null,
        data: updatedData,
      });

      return updatedData;
    } catch (error) {
      console.error("Error en uploadData:", error);
      setState({ isLoading: false, isSuccess: false, error });
      throw error;
    }
  };

  return { ...state, uploadData };
};

export default useFirebase;
