import axios from "axios";
import { authActions } from "./auth-slice";
import showToastMessage from "../components/messages/ShowSuccess";

import { urlAccount } from "../endpoints"; // Asegúrate de ajustar la ruta relativa según sea necesario

export const loginHandler = (email, password, navigate) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${urlAccount}/login`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "x-version": "1",
        },
      }
    );
    // Aquí, asumimos que la API devuelve un objeto con un token y posiblemente más datos
    const { token } = response.data.result;

    // Lógica para manejar la respuesta de la API
    if (token) {
      await showToastMessage({
        title: "Login correcto",
        icon: "success",
        callback: () => {
          setTimeout(() => {
            // redux set
            dispatch(
              authActions.login({
                userEmail: email,
                isMobile: isMobileDevice(),
                authToken: token, // Agrega el token aquí
              })
            );

            navigate("/estates");
          }, 500);
        },
      });
    } else {
      await showToastMessage({
        title: "Login incorrecto",
        icon: "error",
      });
    }
  } catch (error) {
    // Manejo de errores
    console.error("Error al autenticar:", error);
    showToastMessage({
      title: "Error al autenticar",
      icon: "error",
    });
  }
};

const isMobileDevice = () => {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
};
