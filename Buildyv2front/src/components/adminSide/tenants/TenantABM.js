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
  const {
    isLoading,
    isSuccess,
    error: errorAPI,
    uploadData,
    removeData,
  } = useAPI();

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
    tenant && tenant.name ? tenant.name : ""
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
    tenant && tenant.phone1 ? tenant.phone1 : ""
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
    tenant && tenant.phone2 ? tenant.phone2 : ""
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
    tenant && tenant.email ? tenant.email : ""
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
    tenant && tenant.document ? tenant.document : ""
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
    tenant && tenant.comments ? tenant.comments : ""
  );

  const handleCancel = () => {
    navigate("/tenants"); // Reemplaza con la ruta deseada
  };

  const handleDelete = async () => {
    if (tenant && tenant.id) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que quieres eliminar este trabajador?"
      );
      if (confirmDelete) {
        await removeData(urlTenant, tenant.id);
        dispatch(fetchTenantList());
        navigate("/tenants");
      }
    }
  };

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Validar cada campo antes de procesar el formulario
    const isNameValid = name ? name.trim() !== "" : false;
    const isPhone1Valid = phone1 ? /^[0-9]{9}$/.test(phone1.trim()) : false;
    // Asumiendo que los demás campos son opcionales o su validación permite valores nulos
    const isPhone2Valid = true; // Modificar según sea necesario
    const isEmailValid = true; // Modificar según sea necesario
    const isDocumentValid = true; // Modificar según sea necesario
    const isCommentsValid = true; // Modificar según sea necesario

    setIsValidForm(
      isNameValid &&
        isPhone1Valid &&
        isPhone2Valid &&
        isEmailValid &&
        isDocumentValid &&
        isCommentsValid
    );

    // Si el formulario no es válido, no continuar
    if (!isValidForm) {
      return;
    }

    // Crear el objeto para la carga de datos
    const dataToUpload = {
      Name: name,
      Phone1: phone1,
      Phone2: phone2,
      Email: email ? email.trim() : null, // Asumiendo que el email puede ser nulo
      IdentityDocument: document,
      Comments: comments,
    };

    console.log("dataToUpload:", dataToUpload);

    // Intentar enviar los datos
    try {
      await uploadData(dataToUpload, urlTenant, editMode, tenant?.id);
      dispatch(fetchTenantList());

      // Navegar a otra ruta después de un breve retraso
      setTimeout(() => {
        navigate("/tenants");
      }, 1000);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      // Manejo adicional de errores si es necesario
    }
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

  const validatePhone1Input = (input) => {
    const maxDigits = 9;
    const inputValue = input.trim();
    const isValid = /^\d{0,9}$/.test(inputValue);
    // return isValid ? inputValue : inputValue.slice(0, maxDigits);
    return isValid ? inputValue : false;
  };

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <CForm onSubmit={formSubmitHandler}>
          <CCard>
            <CCardBody>
              <CCardTitle>
                {editMode ? "Modificar un inquilino" : "Agregar un inquilino"}
                {editMode && tenant && tenant.id && (
                  <CCol xs="auto" className="d-flex justify-content-end">
                    <CButton color="danger" size="sm" onClick={handleDelete}>
                      Eliminar
                    </CButton>
                  </CCol>
                )}
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
                  type="number"
                  className="cardItem"
                  onChange={(event) => {
                    const validatedInput = validatePhone1Input(
                      event.target.value
                    );
                    if (validatedInput) {
                      inputChangeHandlerPhone1(event);
                    }
                  }}
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
              <CButton
                type="button"
                color="secondary"
                onClick={handleCancel}
                style={{ marginLeft: "10px" }}
              >
                Cancelar
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
