import React, { useState, useEffect } from "react";

import { CWidgetStatsD, CCol, CFormInput, CAlert } from "@coreui/react";

import { LoadingSpinner } from "../../../utils/LoadingSpinner";
import useInput from "../../../hooks/use-input";

import classes from "./WidgetsBrandSlate.module.css";

const WidgetsBrandSlate = (props) => {
  //#region Consts ***********************************

  // Agregar estado para controlar la carga de la imagen
  const [isLoading, setIsLoading] = useState(true);

  const {
    value: enteredNumber,
    isValid: enteredNumberIsValid,
    hasError: numberInputHasError,
    valueChangeHandler: numberInputChangeHandler,
    inputBlurHandler: numberInputBlurHandler,
    reset: resetNumberInput,
  } = useInput(
    (value) =>
      value !== "" && value > -1 && props.currentGlobalVotes <= props.maxValue,
    props.onUpdateVotes,
    props.defaultValue
  );

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    // Aplicar el estilo al montarse el componente
    document.body.style.textAlign = "center !important";

    // Función de limpieza para quitar el estilo al desmontar el componente
    return () => {
      document.body.style.textAlign = "";
    };
  }, []);

  useEffect(() => {
    resetNumberInput(props.defaultValue);
  }, [props.defaultValue]);

  useEffect(() => {
    props.onValidityChange(enteredNumberIsValid, Number(enteredNumber));
  }, [enteredNumberIsValid]);

  //#endregion Hooks ***********************************

  return (
    <CCol sm={6} lg={3} className={classes.cardContainer}>
      <div className={classes.cardContent}>
        <div className={classes.cardImageContainer}>
          {isLoading && <LoadingSpinner />}
          <img
            src={props.imageURL}
            className={classes.cardImage}
            alt="icono"
            onLoad={() => setIsLoading(false)}
            style={{ display: isLoading ? "none" : "block" }}
          />
        </div>
        <div className={classes.cardInfo}>
          <h4 className={classes.cardTitle}>{props.name}</h4>
          <CFormInput
            id={props.id}
            type="number"
            className="cardItem"
            onChange={numberInputChangeHandler}
            onBlur={numberInputBlurHandler}
            value={enteredNumber}
            disabled={props.disabled}
          />
          {numberInputHasError && (
            <CAlert color="danger" className="cardAlert">
              Cantidad inválida
            </CAlert>
          )}
        </div>
      </div>
    </CCol>
  );
};

export default WidgetsBrandSlate;
