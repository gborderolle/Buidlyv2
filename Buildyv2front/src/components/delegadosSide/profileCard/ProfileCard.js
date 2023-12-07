import React, { useState, useEffect } from "react";
import "./ProfileCard.css"; // Tus estilos CSS
import { CFormInput, CAlert, CRow, CCol } from "@coreui/react";
import { LoadingSpinner } from "../../../utils/LoadingSpinner";
import useInput from "../../../hooks/use-input";

const ProfileCard = (props) => {
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

  // Aplicar estilos al montar y desmontar el componente
  useEffect(() => {
    resetNumberInput(props.defaultValue);
  }, [props.defaultValue]);

  useEffect(() => {
    props.onValidityChange(enteredNumberIsValid, Number(enteredNumber));
  }, [enteredNumberIsValid]);

  return (
    <div className="profile-card-container">
      <div className="profile-card-image-container">
        {isLoading && <LoadingSpinner />}
        <img
          src={props.partyImageURL}
          className="profile-card-image"
          alt="party logo"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="profile-card-image-container">
        {isLoading && <LoadingSpinner />}
        <img
          src={props.candidateImageURL}
          className="profile-card-image"
          alt="candidate"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="profile-card-details">
        <h1 style={{ fontSize: "xx-large" }}>{props.name}</h1>
        <CRow className="align-items-center">
          <CCol xs="auto">Votación:</CCol>
          <CCol>
            <CFormInput
              id={props.id}
              type="number"
              className="profile-card-form-input"
              onChange={numberInputChangeHandler}
              onBlur={numberInputBlurHandler}
              value={enteredNumber}
              disabled={props.disabled}
            />
          </CCol>
        </CRow>
        {numberInputHasError && (
          <CAlert color="danger" className="profile-card-alert">
            Cantidad inválida
          </CAlert>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
