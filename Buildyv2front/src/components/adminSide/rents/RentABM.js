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
  CFormCheck,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";
import useAPI from "../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchRentList } from "../../../store/generalData-actions";
import { urlRent } from "../../../endpoints";
import { authActions } from "../../../store/auth-slice";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Este componente de React se utiliza para agregar o modificar un alquiler.
const RentABM = () => {
  //#region Const ***********************************

  const location = useLocation();
  const estate = location.state?.estate;
  const rent = location.state?.estate?.rent;
  const editMode = location.state?.editMode ? location.state?.editMode : false;

  const [isValidForm, setIsValidForm] = useState(true);
  const { isLoading, isSuccess, error: errorAPI, uploadData } = useAPI();

  // DDLs
  const [inputHasErrorTenant, setInputHasErrorTenant] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState([]);

  const monthString = rent?.month;
  const monthDate = monthString ? new Date(monthString) : new Date();
  const [month, setMonth] = useState(monthDate);

  const [inputWarrant, setInputWarrant] = useState(rent?.warrant || "");

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
  const tenantList = useSelector((state) => state.generalData.tenantList);

  const defaultTenantId = rent?.tenant?.id || null;
  const defaultTenant = tenantList.find(
    (tenant) => tenant.id === defaultTenantId
  );
  const [ddlSelectedTenant, setDdlSelectedTenant] = useState(
    defaultTenant || null
  );

  const {
    value: monthlyValue,
    isValid: inputIsValidMonthlyValue,
    hasError: inputHasErrorMonthlyValue,
    valueChangeHandler: inputChangeHandlerMonthlyValue,
    inputBlurHandler: inputBlurHandlerMonthlyValue,
    reset: inputResetMonthlyValue,
  } = useInput(
    (value) => value.trim() !== "",
    null, // onChangeCallback
    rent ? rent.monthlyValue : ""
  );

  const {
    value: duration,
    isValid: inputIsValidDuration,
    hasError: inputHasErrorDuration,
    valueChangeHandler: inputChangeHandlerDuration,
    inputBlurHandler: inputBlurHandlerDuration,
    reset: inputResetDuration,
  } = useInput(
    (value) => true,
    null, // onChangeCallback
    rent ? rent.duration : 1
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
    rent ? rent.comments : ""
  );

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  // Este método se llama cuando se envía el formulario. Se encarga de validar los datos de entrada y de subirlos a la API.
  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se ha seleccionado al menos un inquilino
    if (selectedTenants.length === 0) {
      setInputHasErrorTenant(true);
      return;
    }

    setIsValidForm(
      inputIsValidComments && inputIsValidMonthlyValue && inputIsValidDuration
    );

    if (!isValidForm) {
      return;
    }

    if (isValidForm) {
      try {
        // Subir cada foto en loadedPhotos
        const formData = new FormData();
        loadedPhotos.forEach((photo, index) => {
          formData.append(`ListPhotos`, photo.file); // Aquí no uses índice en el nombre del campo
        });

        // Agrega otros campos del formulario a formData
        formData.append("Warrant", inputWarrant);
        formData.append("MonthlyValue", monthlyValue);
        formData.append("Datetime_monthInit", month.toISOString()); // Asegúrate de enviar la fecha en un formato adecuado
        formData.append("Duration", duration.toString());
        formData.append("RentIsEnded", false);
        formData.append("Comments", comments);
        formData.append("EstateId", estate.id);
        formData.append("ListTenants", selectedTenants);

        console.log("Archivos cargados:", loadedPhotos);
        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        await uploadData(formData, urlReport);
        dispatch(fetchRentList());

        setTimeout(() => {
          navigate("/estates");
        }, 1000);
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
    }
  };

  // Este método se llama cuando se selecciona o se deselecciona un inquilino en el formulario. Se encarga de actualizar el estado de los inquilinos seleccionados.
  const handleSelectCheckboxTenant = (event, tenantId) => {
    if (event.target.checked) {
      setSelectedTenants((prevTenants) => [...prevTenants, tenantId]);
    } else {
      setSelectedTenants((prevTenants) =>
        prevTenants.filter((id) => id !== tenantId)
      );
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
                {editMode ? "Modificar un alquiler" : "Agregar un alquiler"}
              </CCardTitle>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Inquilino
                </CInputGroupText>
                <div
                  style={{
                    border: "1px solid lightgray",
                    padding: "10px",
                    borderRadius: "5px",
                    minWidth: "50%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                  }}
                >
                  {tenantList.map((tenant) => (
                    <CFormCheck
                      key={tenant.id}
                      id={`tenant-${tenant.id}`}
                      label={`${tenant.id}: ${tenant.name} (${tenant.phone1})`}
                      checked={selectedTenants.includes(tenant.id)} // Establecer la propiedad checked
                      onChange={(event) =>
                        handleSelectCheckboxTenant(event, tenant.id)
                      }
                      style={{
                        color: "#0d6efd",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginBottom: "10px",
                        marginLeft: "1px",
                      }}
                    />
                  ))}
                </div>

                {/*  */}
                {inputHasErrorTenant && (
                  <CAlert color="danger" className="w-100">
                    Por favor, selecciona al menos un inquilino.
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Garantía
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  value={inputWarrant}
                  onChange={(e) => setInputWarrant(e.target.value)}
                  style={{ flex: "1" }} // Asegura que el input tome el máximo espacio posible
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px", // Espaciar el checkbox del input
                  }}
                >
                  <CFormCheck
                    id="luc-checkbox"
                    label="LUC"
                    checked={inputWarrant === "LUC"}
                    onChange={(event) =>
                      event.target.checked
                        ? setInputWarrant("LUC")
                        : setInputWarrant("")
                    }
                  />
                </div>
              </CInputGroup>

              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Valor mensual $
                </CInputGroupText>
                <CFormInput
                  type="number"
                  step="0.01"
                  className="cardItem"
                  onChange={inputChangeHandlerMonthlyValue}
                  onBlur={inputBlurHandlerMonthlyValue}
                  value={monthlyValue}
                  required
                />
                {inputHasErrorMonthlyValue && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText>Fecha del inicio</CInputGroupText>
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
                  Duración (años)
                </CInputGroupText>
                <CFormInput
                  type="number"
                  className="cardItem"
                  onChange={inputChangeHandlerDuration}
                  onBlur={inputBlurHandlerDuration}
                  value={duration}
                />
                {inputHasErrorDuration && (
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
      </CCol>
    </CRow>
  );
};

export default RentABM;
