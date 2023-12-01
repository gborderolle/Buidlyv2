import { React, useState, useEffect } from "react";

import {
  CCol,
  CRow,
  CBadge,
  CButton,
  CCardFooter,
  CSpinner,
  CCardTitle,
  CCardBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CForm,
  CCard,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";

import "./Item.css";

const Item = (props) => {
  const {
    value: enteredNumber,
    isValid: enteredNumberIsValid,
    hasError: numberInputHasError,
    valueChangeHandler: numberInputChangeHandler,
    inputBlurHandler: numberInputBlurHandler,
    reset: resetNumberInput,
  } = useInput(
    (value) => value !== "" && value > -1 && value < 200,
    props.onUpdateVotes, // Aquí va la función que actualizará el estado en el componente Formulario
    props.defaultValue // valor por defecto para enteredNumber
  );

  useEffect(() => {
    if (typeof props.totalPartyVotes == "undefined") {
      props.onValidityChange(enteredNumberIsValid, enteredNumber);
    }
  }, [enteredNumberIsValid]);

  // const numberInputClasses = numberInputHasError
  //   ? "form-control is-invalid form-control-lg"
  //   : "form-control form-control-lg";

  // const inputClass = `
  //   ${classes.inputStyle}
  //   ${numberInputClasses}
  //   ${props.disabled ? classes.disabledInputStyle : ""}
  // `;

  return (
    <>
      <CCardBody className="cardBody p-1">
        <CInputGroup>
          <CInputGroupText className="cardItem custom-input-group-text">
            {props.title}
          </CInputGroupText>
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
            <CAlert color="danger" className="w-100">
              Cantidad inválida
            </CAlert>
          )}
        </CInputGroup>
      </CCardBody>
    </>
  );
};

export default Item;
