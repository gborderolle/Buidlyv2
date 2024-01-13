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
  CDropdown,
  CDropdownItem,
  CDropdownToggle,
  CDropdownMenu,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";
import useAPI from "../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkerList } from "../../../store/generalData-actions";
import { urlWorker } from "../../../endpoints";
import { authActions } from "../../../store/auth-slice";

const WorkerABM = () => {
  //#region Const ***********************************

  const location = useLocation();
  const worker = location.state?.worker;
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
  const jobList = useSelector((state) => state.generalData.jobList);

  const defaultJobId = worker?.job?.id || null;
  const defaultJob = jobList.find((job) => job.id === defaultJobId);
  const [ddlSelectedJob, setDdlSelectedJob] = useState(defaultJob || null);

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
    worker && worker.name ? worker.name : ""
  );

  const {
    value: phone,
    isValid: inputIsValidPhone,
    hasError: inputHasErrorPhone,
    valueChangeHandler: inputChangeHandlerPhone,
    inputBlurHandler: inputBlurHandlerPhone,
    reset: inputResetPhone,
  } = useInput(
    (value) => /^[0-9]{9}$/.test(value.trim()), // validateValue function
    null, // onChangeCallback
    worker ? worker.phone : ""
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
    worker ? worker.email : ""
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
    worker ? worker.document : ""
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
    worker ? worker.comments : ""
  );

  const handleCancel = () => {
    navigate("/workers"); // Reemplaza con la ruta deseada
  };

  const handleDelete = async () => {
    if (worker && worker.id) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que quieres eliminar este trabajador?"
      );
      if (confirmDelete) {
        await removeData(urlWorker, worker.id);
        dispatch(fetchWorkerList());
        navigate("/workers");
      }
    }
  };

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar que cada campo no sea null antes de llamar a trim() y realizar la validación
    const isNameValid = name ? name.trim() !== "" : false;
    const isPhoneValid = phone ? /^[0-9]{9}$/.test(phone.trim()) : false;
    const isEmailValid = email ? email.trim() !== "" : false; // Asumiendo que el email es obligatorio
    const isDocumentValid = document ? document.trim() !== "" : false; // Asumiendo que el documento es obligatorio
    const isCommentsValid = comments ? comments.trim() !== "" : true; // Asumiendo que los comentarios son opcionales

    setIsValidForm(
      isNameValid &&
        isPhoneValid &&
        isEmailValid &&
        isDocumentValid &&
        isCommentsValid
    );

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: name,
      Phone: phone,
      Email: email ? email.trim() : null, // Asigna null si el email está vacío
      IdentityDocument: document,
      Comments: comments,
      JobId: ddlSelectedJob ? ddlSelectedJob.id : null,
    };

    console.log("dataToUpload:", dataToUpload);

    try {
      await uploadData(dataToUpload, urlWorker, editMode, worker?.id);
      dispatch(fetchWorkerList());

      setTimeout(() => {
        navigate("/workers");
      }, 1000);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div>
                  <CCardTitle>
                    {editMode
                      ? "Modificar un trabajador"
                      : "Agregar un trabajador"}
                  </CCardTitle>
                </div>
                {editMode && worker && worker.id && (
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={handleDelete}
                    style={{ marginLeft: "auto" }}
                  >
                    Eliminar
                  </CButton>
                )}
              </div>
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
                      inputChangeHandlerPhone(event);
                    }
                  }}
                  onBlur={inputBlurHandlerPhone}
                  value={phone}
                />
                {inputHasErrorPhone && (
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
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Obra
                </CInputGroupText>
                {/*  */}
                <CDropdown>
                  <CDropdownToggle id="ddJob" color="secondary">
                    {ddlSelectedJob ? ddlSelectedJob.name : "Seleccionar"}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {jobList &&
                      jobList.length > 0 &&
                      jobList.map((job) => (
                        <CDropdownItem
                          key={job.id}
                          onClick={() => handleSelectDdlJob(job)}
                          style={{ cursor: "pointer" }}
                          value={job.id}
                        >
                          {job.id}: {job.name}
                        </CDropdownItem>
                      ))}
                  </CDropdownMenu>
                </CDropdown>

                {/*  */}
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

export default WorkerABM;
