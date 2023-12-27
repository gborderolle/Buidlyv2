import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  CRow,
  CCol,
  CButton,
  CSpinner,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CForm,
  CCard,
  CCardTitle,
  CCardBody,
  CCardFooter,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";
import useAPI from "../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchTenantList } from "../../../store/generalData-actions";
import { urlTenant } from "../../../endpoints";
import { authActions } from "../../../store/auth-slice";

const TenantABM = () => {
  //#region Const ***********************************

  const location = useLocation();
  const tenant = location.state?.tenant;
  const editMode = location.state?.editMode ? location.state?.editMode : false;

  const [isValidForm, setIsValidForm] = useState(true);
  const { isLoading, isSuccess, error: errorAPI, uploadData } = useAPI();

  // redux
  const dispatch = useDispatch();

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.userEmail);
  useEffect(() => {
    if (!userEmail) {
      dispatch(authActions.logout());
      navigate("/login");
    }
  }, [userEmail, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  // Redux
  const cityList = useSelector((state) => state.generalData.cityList);
  const provinceList = useSelector((state) => state.generalData.provinceList);
  const countryList = useSelector((state) => state.generalData.countryList);

  const {
    value: name,
    isValid: inputIsValidName,
    hasError: inputHasErrorName,
    valueChangeHandler: inputChangeHandlerName,
    inputBlurHandler: inputBlurHandlerName,
    reset: inputResetName,
  } = useInput(
    (value) => value.trim() !== "", // validateValue function
    null, // onChangeCallback
    tenant ? tenant.name : ""
  );

  const {
    value: phone1,
    isValid: inputIsValidPhone1,
    hasError: inputHasErrorPhone1,
    valueChangeHandler: inputChangeHandlerPhone1,
    inputBlurHandler: inputBlurHandlerPhone1,
    reset: inputResetPhone1,
  } = useInput(
    (value) => /^[0-9]{9}$/.test(value.trim()), // validateValue function
    null, // onChangeCallback
    tenant ? tenant.phone1 : ""
  );

  const {
    value: phone2,
    hasError: inputHasErrorPhone2,
    valueChangeHandler: inputChangeHandlerPhone2,
    inputBlurHandler: inputBlurHandlerPhone2,
    reset: inputResetPhone2,
  } = useInput(
    (value) => true,
    null, // onChangeCallback
    tenant ? tenant.phone2 : ""
  );

  const {
    value: email,
    isValid: inputIsValidEmail,
    hasError: inputHasErrorEmail,
    valueChangeHandler: inputChangeHandlerEmail,
    inputBlurHandler: inputBlurHandlerEmail,
    reset: inputResetEmail,
  } = useInput(
    (value) => true,
    null, // onChangeCallback
    tenant ? tenant.email : ""
  );

  const {
    value: document,
    isValid: inputIsValidDocument,
    hasError: inputHasErrorDocument,
    valueChangeHandler: inputChangeHandlerDocument,
    inputBlurHandler: inputBlurHandlerDocument,
    reset: inputResetDocument,
  } = useInput(
    (value) => true,
    null, // onChangeCallback
    tenant ? tenant.document : ""
  );

  const {
    value: comments,
    isValid: inputIsValidComments,
    hasError: inputHasErrorComments,
    valueChangeHandler: inputChangeHandlerComments,
    inputBlurHandler: inputBlurHandlerComments,
    reset: inputResetComments,
  } = useInput(
    (value) => true,
    null, // onChangeCallback
    tenant ? tenant.comments : ""
  );

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    setIsValidForm(
      inputIsValidName &&
        inputIsValidPhone1 && // Solo phone1 es obligatorio
        inputIsValidEmail &&
        inputIsValidDocument &&
        inputIsValidComments
    );

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: name,
      Phone1: phone1,
      Phone2: phone2,
      Email: email.trim() === "" ? null : email, // Asigna null si el email está vacío
      IdentityDocument: document,
      Comments: comments,
    };
    console.log("dataToUpload:", dataToUpload);

    try {
      await uploadData(dataToUpload, urlTenant);
      dispatch(fetchTenantList());

      inputResetName();
      inputResetPhone1();
      inputResetPhone2();
      inputResetEmail();
      inputResetDocument();
      inputResetComments();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <CForm onSubmit={formSubmitHandler}>
          <CCard>
            <CCardBody>
              <CCardTitle>
                {editMode ? "Modificar un inquilino" : "Agregar un inquilino"}
              </CCardTitle>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Nombre completo
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerName}
                  onBlur={inputBlurHandlerName}
                  value={name}
                />
                {inputHasErrorName && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Celular [9 dígitos]
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerPhone1}
                  onBlur={inputBlurHandlerPhone1}
                  value={phone1}
                />
                {inputHasErrorPhone1 && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Teléfono 2
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerPhone2}
                  onBlur={inputBlurHandlerPhone2}
                  value={phone2}
                />
                {inputHasErrorPhone2 && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Email
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerEmail}
                  onBlur={inputBlurHandlerEmail}
                  value={email}
                />
                {inputHasErrorEmail && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Cédula
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerDocument}
                  onBlur={inputBlurHandlerDocument}
                  value={document}
                />
                {inputHasErrorDocument && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Comentarios
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerComments}
                  onBlur={inputBlurHandlerComments}
                  value={comments}
                />
                {inputHasErrorComments && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
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
                {errorAPI && (
                  <CAlert color="danger" className="w-100">
                    {errorAPI}
                  </CAlert>
                )}
              </CCardFooter>
            </CCardBody>
          </CCard>
        </CForm>
        <br />
        <br />
      </CCol>
    </CRow>
  );
};

export default TenantABM;
