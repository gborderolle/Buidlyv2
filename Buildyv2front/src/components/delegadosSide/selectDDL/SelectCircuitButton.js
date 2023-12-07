import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CForm, CButton, CAlert, CRow, CCol } from "@coreui/react";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";

import "../steps/FormStart.css";

const buttonColor = "dark";

const SelectCircuitButton = (props) => {
  //#region Consts ***********************************
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // redux get
  const reduxSelectedCircuit = useSelector(
    (state) => state.liveSettings.circuit
  );

  // redux
  const dispatch = useDispatch();

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    dispatch(uiActions.showToast());

    if (!reduxSelectedCircuit) {
      setShowAlert(true); // Mostrar alerta si el circuito no está seleccionado
    } else {
      setShowAlert(false); // No mostrar alerta si el circuito está seleccionado
      navigate("/formSlate1");
    }
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

  //#endregion Functions ***********************************

  //#region JSX props ***********************************

  //#endregion JSX props ***********************************

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CRow>
        <CCol>
          <CForm onSubmit={formSubmitHandler}>
            {showAlert && (
              <CAlert color="danger">Seleccione un circuito</CAlert>
            )}
            {!showAlert && <br />}
            <CButton type="submit" size="lg" color={buttonColor}>
              Empezar
            </CButton>
          </CForm>
        </CCol>
      </CRow>
    </div>
  );
};
export default SelectCircuitButton;
