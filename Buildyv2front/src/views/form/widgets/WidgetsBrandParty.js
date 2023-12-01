import React, { useState, useEffect } from "react";

import { CWidgetStatsD, CCol } from "@coreui/react";
import { CFormInput, CAlert } from "@coreui/react";

import { LoadingSpinner } from "../../../utils/LoadingSpinner";
import useInput from "../../../hooks/use-input";

import classes from "./WidgetsBrandParty.module.css";

const WidgetsBrandParty = (props) => {
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
    <CCol sm={6} lg={3}>
      <CWidgetStatsD
        className="mb-4"
        icon={
          <div className={classes.imgContainer}>
            {isLoading && <LoadingSpinner />}

            <img
              src={props.imageURL}
              className={classes.img}
              alt="icono"
              onLoad={() => setIsLoading(false)} // Oculta el spinner una vez que la imagen se ha cargado
              style={{ display: isLoading ? "none" : "block" }} // Oculta la imagen mientras se está cargando
            />
          </div>
        }
        values={[
          { value: props.name },
          {
            value: (
              <CFormInput
                id={props.id}
                type="number"
                className="cardItem"
                onChange={numberInputChangeHandler}
                onBlur={numberInputBlurHandler}
                value={enteredNumber}
                disabled={props.disabled}
              />
            ),
          },
        ]}
      />
      {numberInputHasError && (
        <CAlert color="danger" className="w-100">
          Cantidad inválida
        </CAlert>
      )}
    </CCol>
  );
};

export default WidgetsBrandParty;
