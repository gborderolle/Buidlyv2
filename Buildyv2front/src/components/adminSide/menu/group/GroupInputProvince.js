import React from "react";
import { useState } from "react";

import {
  CRow,
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
import useInput from "../../../../hooks/use-input";
import useFirebase from "../../../../hooks/use-firebase";

// redux imports
import { useDispatch } from "react-redux";
// import { fetchProvinceList } from "../../../../store/generalData-actions";

import "./GroupInput.css";

const GroupInputProvince = (props) => {
  //#region Consts ***********************************

  const [isValidForm, setIsValidForm] = useState(true); // Declarar e inicializar isValidForm

  const { isLoading, isSuccess, uploadData } = useFirebase();

  // Redux fetch DB
  const dispatch = useDispatch();

  const {
    value: provinceName,
    isValid: inputIsValid1,
    hasError: inputHasError1,
    valueChangeHandler: inputChangeHandler1,
    inputBlurHandler: inputBlurHandler1,
    reset: inputReset1,
  } = useInput((value) => value.trim() !== "");

  const {
    value: provinceCenter,
    isValid: inputIsValid2,
    hasError: inputHasError2,
    valueChangeHandler: inputChangeHandler2,
    inputBlurHandler: inputBlurHandler2,
    reset: inputReset2,
  } = useInput((value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
      return true; // Ingreso vacío permitido
    }
    const regex = /^-?\d+\.\d+,\s*-?\d+\.\d+$/;
    return regex.test(trimmedValue); // Comprobar el patrón de latitud y longitud
  });

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    setIsValidForm(inputIsValid1 && inputIsValid2); // Actualizar la validez del formulario

    if (!isValidForm) {
      return;
    }

    // Asignar valor por defecto si inputValue3 está vacío

    const dataToUpload = await props.createDataToUpload(
      provinceName,
      provinceCenter
    );

    await uploadData(
      dataToUpload,
      props.firebaseUrlFinal,
      props.firebaseUrlClean
    );

    // Redux fetch DB
    // dispatch(fetchProvinceList()); // refresh DB data

    inputReset1();
    inputReset2();
  };

  //#endregion Events ***********************************

  return (
    <CForm onSubmit={formSubmitHandler}>
      <CAccordion>
        <CAccordionItem itemKey={1}>
          <CAccordionHeader className="custom-accordion-header">
            {props.title}
          </CAccordionHeader>
          <CAccordionBody>
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.labelName}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler1}
                onBlur={inputBlurHandler1}
                value={provinceName}
              />
              {inputHasError1 && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.labelCenter}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler2}
                onBlur={inputBlurHandler2}
                value={provinceCenter}
              />
              {inputHasError2 && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <CRow className="justify-content-center">
              {isLoading && (
                <div className="text-center">
                  <CSpinner />
                </div>
              )}
            </CRow>
            <br />
            <CButton type="submit" color="dark">
              Confirmar
            </CButton>
            <br />
            <br />
            <CCardFooter className="text-medium-emphasis">
              {!isValidForm && (
                <CAlert color="danger" className="w-100">
                  El formulario no es válido
                </CAlert>
              )}
              {isSuccess && (
                <CAlert color="success" className="w-100">
                  Datos ingresados correctamente
                </CAlert>
              )}
            </CCardFooter>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CForm>
  );
};

export default GroupInputProvince;
