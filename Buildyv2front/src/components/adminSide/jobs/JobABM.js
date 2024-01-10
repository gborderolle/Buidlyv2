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
import { fetchJobList } from "../../../store/generalData-actions";
import { urlJob } from "../../../endpoints";
import { authActions } from "../../../store/auth-slice";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const JobABM = () => {
  //#region Const ***********************************

  const location = useLocation();
  const job = location.state?.job;
  const editMode = location.state?.editMode ? location.state?.editMode : false;

  const [isValidForm, setIsValidForm] = useState(true);
  const { isLoading, isSuccess, error: errorAPI, uploadData } = useAPI();

  // DDLs
  const [inputHasErrorEstate, setInputHasErrorEstate] = useState(false);
  const [inputHasErrorWorker, setInputHasErrorWorker] = useState(false);

  const monthString = job?.month;
  const monthDate = monthString ? new Date(monthString) : new Date();
  const [month, setMonth] = useState(monthDate);

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
  const estateList = useSelector((state) => state.generalData.estateList);
  const workerList = useSelector((state) => state.generalData.workerList);

  const defaultEstateId = job?.estate?.id || null;
  const defaultEstate = estateList.find(
    (estate) => job?.estate?.id === defaultEstateId
  );
  const [ddlSelectedEstate, setDdlSelectedEstate] = useState(
    defaultEstate || null
  );

  const defaultWorkerId = job?.worker?.id || null;
  const defaultWorker = workerList.find(
    (worker) => job?.worker?.id === defaultWorkerId
  );
  const [ddlSelectedWorker, setDdlSelectedWorker] = useState(
    defaultWorker || null
  );

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
    job ? job.name : ""
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
    job ? job.comments : ""
  );

  const {
    value: cost,
    isValid: inputIsValidCost,
    hasError: inputHasErrorCost,
    valueChangeHandler: inputChangeHandlerCost,
    inputBlurHandler: inputBlurHandlerCost,
    reset: inputResetCost,
  } = useInput(
    (value) => value.trim() !== "", // validateValue function
    null, // onChangeCallback
    job ? job.cost : ""
  );

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidEstate = ddlSelectedEstate !== null;
    if (!inputIsValidEstate) {
      setInputHasErrorEstate(true);
      return;
    }
    const inputIsValidWorker = ddlSelectedWorker !== null;
    if (!inputIsValidWorker) {
      setInputHasErrorWorker(true);
      return;
    }

    setIsValidForm(
      inputIsValidName &&
        inputIsValidComments &&
        inputIsValidCost &&
        inputIsValidEstate &&
        inputIsValidWorker
    );

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: name,
      Month: month.toISOString().split("T")[0], // Asegúrate de formatear la fecha correctamente
      Comments: comments,
      LabourCost: cost,
      EstateId: ddlSelectedEstate.id,
      ListWorkers: ddlSelectedWorker ? [ddlSelectedWorker] : [], // Enviar como lista
    };
    console.log("dataToUpload:", dataToUpload);

    try {
      await uploadData(dataToUpload, urlJob, editMode, job?.id);
      dispatch(fetchJobList());

      setTimeout(() => {
        navigate("/jobs");
      }, 1000);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleSelectDdlEstate = (item) => {
    setDdlSelectedEstate(item);
  };
  const handleSelectDdlWorker = (item) => {
    setDdlSelectedWorker(item);
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
                {editMode ? "Modificar una obra" : "Agregar una obra"}
              </CCardTitle>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Propiedad
                </CInputGroupText>
                {/*  */}
                <CDropdown>
                  <CDropdownToggle id="ddlEstate" color="secondary">
                    {ddlSelectedEstate ? ddlSelectedEstate.name : "Seleccionar"}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {estateList &&
                      estateList.length > 0 &&
                      estateList.map((estate) => (
                        <CDropdownItem
                          key={estate.id}
                          onClick={() => handleSelectDdlEstate(estate)}
                          style={{ cursor: "pointer" }}
                          value={estate.id}
                        >
                          {estate.id}: {estate.name} ({estate.cityDS?.name})
                        </CDropdownItem>
                      ))}
                  </CDropdownMenu>
                </CDropdown>

                {/*  */}
                {inputHasErrorEstate && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Trabajador
                </CInputGroupText>
                {/*  */}
                <CDropdown>
                  <CDropdownToggle id="ddlWorker" color="secondary">
                    {ddlSelectedWorker ? ddlSelectedWorker.name : "Seleccionar"}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {workerList &&
                      workerList.length > 0 &&
                      workerList.map((worker) => (
                        <CDropdownItem
                          key={worker.id}
                          onClick={() => handleSelectDdlWorker(worker)}
                          style={{ cursor: "pointer" }}
                          value={worker.id}
                        >
                          {worker.id}: {worker.name}
                        </CDropdownItem>
                      ))}
                  </CDropdownMenu>
                </CDropdown>

                {/*  */}
                {inputHasErrorWorker && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Nombre de la obra
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
                <CInputGroupText>Fecha de la obra</CInputGroupText>
                <DatePicker
                  selected={month}
                  onChange={(date) => setMonth(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className="form-control"
                />
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
                  Costo de la obra $
                </CInputGroupText>
                <CFormInput
                  type="number"
                  className="cardItem"
                  onChange={inputChangeHandlerCost}
                  onBlur={inputBlurHandlerCost}
                  value={cost}
                />
                {inputHasErrorCost && (
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

export default JobABM;
