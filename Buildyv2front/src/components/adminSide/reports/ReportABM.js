import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";

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
import { fetchReportList } from "../../../store/generalData-actions";
import { urlReport } from "../../../endpoints";
import { authActions } from "../../../store/auth-slice";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./uploadFiles.css";
import FileUpload, { uploadFileToServer } from "./FileUpload.js";

const ReportABM = () => {
  //#region Const ***********************************

  const location = useLocation();
  const report = location.state?.report;
  const editMode = location.state?.editMode ? location.state?.editMode : false;

  const [isValidForm, setIsValidForm] = useState(true);
  const { isLoading, isSuccess, error: errorAPI, uploadData } = useAPI();

  const [inputHasErrorEstate, setInputHasErrorEstate] = useState(false);

  const monthString = report?.month;
  const monthDate = monthString ? new Date(monthString) : new Date();
  const [month, setMonth] = useState(monthDate);

  const [loadedPhotos, setLoadedPhotos] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const defaultEstateId = report?.estate?.id || null;
  const defaultEstate = estateList.find(
    (estate) => report?.estate?.id === defaultEstateId
  );
  const [ddlSelectedEstate, setDdlSelectedEstate] = useState(
    defaultEstate || null
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
    report ? report.name : ""
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
    report ? report.comments : ""
  );

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    if (editMode && report?.listPhotosURL) {
      const existingPhotos = report.listPhotosURL.map((url) => ({
        url, // URL de la foto existente
        isExisting: true, // Marca para identificar que es una foto ya existente
      }));
      setLoadedPhotos(existingPhotos);
    }
  }, [editMode, report]);

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

    setIsValidForm(
      inputIsValidName && inputIsValidComments && inputIsValidEstate
    );

    if (isValidForm) {
      try {
        // Subir cada foto en loadedPhotos
        const formData = new FormData();
        loadedPhotos.forEach((photo, index) => {
          formData.append(`ListPhotos`, photo.file); // Aquí no uses índice en el nombre del campo
        });

        // Agrega otros campos del formulario a formData
        formData.append("Name", name);
        formData.append("Month", month.toISOString()); // Asegúrate de enviar la fecha en un formato adecuado
        formData.append("Comments", comments);
        formData.append("EstateId", ddlSelectedEstate.id);

        console.log("Archivos cargados:", loadedPhotos);
        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        await uploadData(formData, urlReport);
        dispatch(fetchReportList());

        setTimeout(() => {
          navigate("/reports");
        }, 1000);
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
    }
  };

  const handleSelectDdlEstate = (item) => {
    setDdlSelectedEstate(item);
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

  // Esta función se llama cuando se cargan nuevos archivos
  const handleFileUpload = (newFiles) => {
    setLoadedPhotos((currentFiles) => [
      ...currentFiles,
      ...newFiles.map((file) => ({
        file,
        type: file.type,
        name: file.name,
      })),
    ]);
  };

  // Modificar la función de renderizado para manejar fotos existentes
  const renderPhotoPreviews = () => {
    return (
      <div style={{ display: "flex", overflowX: "auto", gap: "10px" }}>
        {loadedPhotos.map((photo, index) => (
          <div
            key={index}
            style={{ flex: "0 0 auto" }}
            onClick={() => openModal(photo.url)}
          >
            <img
              src={photo.url}
              alt={`Foto ${index}`}
              style={{ width: "100px", height: "100px", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
    );
  };

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <CForm onSubmit={formSubmitHandler}>
          <CCard>
            <CCardBody>
              <CCardTitle>
                {editMode ? "Modificar un reporte" : "Agregar un reporte"}
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
                  Nombre del reporte
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
                <CInputGroupText>Fecha del reporte</CInputGroupText>
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

              <FileUpload
                multiple={true}
                name="example-upload"
                maxSize={300000}
                onUpload={handleFileUpload}
                label="Cargar fotos"
              />
              {editMode && (
                <>
                  <br />
                  <div>{renderPhotoPreviews()}</div>

                  <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Imagen Ampliada"
                  >
                    <img
                      src={selectedImage}
                      alt="Imagen Ampliada"
                      style={{ width: "500px" }}
                    />
                    <button onClick={closeModal}>Cerrar</button>
                  </Modal>
                </>
              )}
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

export default ReportABM;
