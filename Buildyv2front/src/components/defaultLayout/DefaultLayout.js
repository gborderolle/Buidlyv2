import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppFooterMobileAdmin,
  AppFooterMobileDelegados,
  AppHeader,
} from "../index";

// Redux import
import { authActions } from "../../store/auth-slice";

import classes from "./DefaultLayout.module.css";

// Redux imports
import { batch, useDispatch, useSelector } from "react-redux";
import {
  fetchEstates,
  fetchJobs,
  fetchRents,
  fetchWorkers,
} from "../../store/generalData-actions";

const DefaultLayout = () => {
  //#region Consts

  const navigate = useNavigate();

  // Redux get
  const userRoleNumber = useSelector((state) => state.auth.userRoleNumber);

  // LocalStorage get
  const isMobile = JSON.parse(localStorage.getItem("isMobile"));

  // Redux fetch DB
  const dispatch = useDispatch();

  //#endregion Consts

  //#region Hooks

  // Hook para revisar expiración del token
  useEffect(() => {
    const checkTokenExpiration = () => {
      const isLoggedInData = JSON.parse(localStorage.getItem("isLoggedIn"));
      if (!isLoggedInData || new Date().getTime() >= isLoggedInData.expiry) {
        dispatch(authActions.logout());
        navigate("/login-general");
      }
    };

    const intervalId = setInterval(() => {
      checkTokenExpiration();
      // }, 300000); // 300000 ms son 5 minutos
    }, 3600000); // 3600000 ms son 1 hora

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Redux fetch DB (carga inicial)
  useEffect(() => {
    if (isMobile) {
      // Aplicar estilos al montar el componente
      document.documentElement.style.fontSize = "small";
      document.body.style.fontSize = "small";
    }

    const fetchLoggedUserData = async () => {
      // dispatch(fetchMyParty());
    };

    const fetchGeneralData = async () => {
      batch(() => {
        dispatch(fetchEstates());
        dispatch(fetchJobs());
        dispatch(fetchRents());
        dispatch(fetchWorkers());
      });
    };
    fetchLoggedUserData();
    fetchGeneralData();

    // Limpiar estilos al desmontar el componente
    return () => {
      document.documentElement.style.fontSize = "";
      document.body.style.fontSize = "";
    };
  }, [dispatch]);

  //#endregion Hooks

  return (
    <div>
      {!isMobile && <AppSidebar />}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        &nbsp;
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        {userRoleNumber == 1 && !isMobile && (
          <AppFooter className={classes.AppFooter} />
        )}
        {userRoleNumber == 1 && isMobile && (
          <AppFooterMobileAdmin
            userRoleNumber={userRoleNumber}
            className={classes.AppFooter}
          />
        )}
        {userRoleNumber == 2 && (
          <AppFooterMobileDelegados
            userRoleNumber={userRoleNumber}
            className={classes.AppFooter}
          />
        )}
      </div>
    </div>
  );
};

export default DefaultLayout;
