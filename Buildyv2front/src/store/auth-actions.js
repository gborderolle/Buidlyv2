import { authActions } from "./auth-slice";
import { loggedUserActions } from "./loggedUser-slice";
import showToastMessage from "../components/messages/ShowSuccess";

import { database, FirebaseUrls } from "../utils/firebaseSetup";
import { get, ref } from "firebase/database";

export const loginGeneralHandler =
  (username, password, navigate) => async (dispatch) => {
    try {
      const usersRef = ref(database, "userList"); // Asegúrate de que "userList" sea la ruta correcta en tu Firebase
      const snapshot = await get(usersRef);
      const users = snapshot.val();

      let user = null;
      for (const userId in users) {
        if (
          users[userId].username.toLowerCase() ===
            username.trim().toLowerCase() &&
          users[userId].userPassword === password
        ) {
          user = users[userId];
          break;
        }
      }

      // Verificación del usuario "base"
      if (
        !user &&
        username.trim().toLowerCase() === "admin" &&
        password === "admin"
      ) {
        user = {
          userFullname: "Administrador",
          userProvinceId: 1, // Ajusta estos valores según sea necesario
          userMunicipalityId: 1,
          userRoleNumber: 1,
          userId: 0,
        };
      }

      if (user) {
        await showToastMessage({
          title: "Login correcto",
          icon: "success",
          callback: () => {
            setTimeout(() => {
              // redux set
              dispatch(
                loggedUserActions.setProvince(Number(user.userProvinceId))
              );
              dispatch(
                loggedUserActions.setMunicipality(
                  Number(user.userMunicipalityId)
                )
              );
              dispatch(
                loggedUserActions.setUserRole(Number(user.userRoleNumber))
              );
              dispatch(loggedUserActions.setUserFullname(user.userFullname));

              // redux set
              dispatch(
                authActions.login({
                  userProvinceId: Number(user.userProvinceId),
                  userMunicipalityId: Number(user.userMunicipalityId),
                  userRoleNumber: Number(user.userRoleNumber),
                  userFullname: user.userFullname,
                  userId: user.userId,
                  isMobile: isMobileDevice(),
                })
              );

              if (user.userRoleNumber == 1) {
                navigate("/dashboard");
              } else {
                navigate("/form");
              }
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
      console.error("Error al autenticar:", error);
    }
  };

const isMobileDevice = () => {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
};
