import React, { useEffect } from "react";

import {
  CCardBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CCol,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";

import classes from "./Item.module.css";

const Item = (props) => {
  const {
    value: enteredNumber,
    isValid: enteredNumberIsValid,
    hasError: numberInputHasError,
    valueChangeHandler: numberInputChangeHandler,
    inputBlurHandler: numberInputBlurHandler,
    reset: resetNumberInput,
  } = useInput(
    (value) => value !== "" && value > -1,
    // && value + props.otherVotes <= props.maximumVotes,
    props.onUpdateVotes,
    props.defaultValue
  );

  useEffect(() => {
    props.onValidityChange(enteredNumberIsValid, Number(enteredNumber));
  }, [enteredNumberIsValid]);

  return (
    <>
      <CCol style={{ textAlign: "-webkit-center" }}>
        <CCardBody className="p-1">
          <CInputGroup className={classes.cardBody}>
            <CInputGroupText
              className={`${classes.cardItem} ${classes.inputText}`}
            >
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
      </CCol>
    </>
  );
};

export default Item;
