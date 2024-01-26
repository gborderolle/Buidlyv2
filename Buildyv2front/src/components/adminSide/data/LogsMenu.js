import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CCol, CRow, CCard, CCardHeader, CCardBody } from "@coreui/react";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import LogsTable from "./LogsTable";

const LogsMenu = () => {
  //#region Const ***********************************

  // redux
  const dispatch = useDispatch();

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const username = useSelector((state) => state.auth.username);
  useEffect(() => {
    if (!username) {
      dispatch(authActions.logout());
      navigate("/login");
    }
  }, [username, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  //#endregion Const ***********************************

  //#region Functions ***********************************

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <CCard>
          <CCardHeader>Tabla de logs</CCardHeader>
          <CCardBody>
            <LogsTable />
          </CCardBody>
        </CCard>
        <br />
      </CCol>
    </CRow>
  );
};

export default LogsMenu;
