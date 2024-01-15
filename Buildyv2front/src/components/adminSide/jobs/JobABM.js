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
import { fetchJobList } from "../../../store/generalData-actions";
import { urlJob } from "../../../endpoints";
import { authActions } from "../../../store/auth-slice";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../utils/FileUpload.css";
import FileUpload from "../../../utils/FileUpload.js";

const JobABM = () => {
  //#region Const ***********************************

  const location = useLocation();
  const job = location.state?.job;
  const editMode = location.state?.editMode ? location.state?.editMode : false;

  const [isValidForm, setIsValidForm] = useState(true);
  const {
    isLoading,
    isSuccess,
    error: errorAPI,
    uploadData,
    removeData,
  } = useAPI();

  // DDLs
  const [inputHasErrorEstate, setInputHasErrorEstate] = useState(false);
  const [inputHasErrorWorker, setInputHasErrorWorker] = useState(false);

  const monthString = job?.month;
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
  const workerList = useSelector((state) => state.generalData.workerList);

  const defaultEstateId = job?.estate?.id || null;
  const defaultEstate = estateList.find(
    (estate) => job?.estate?.id === defaultEstateId
  );
  const [ddlSelectedEstate, setDdlSelectedEstate] = useState(
    defaultEstate || null
  );

  const defaultWorker =
    job?.listWorkers?.length > 0
      ? workerList.find(
          (worker) =>
            worker.id === job.listWorkers[job.listWorkers.length - 1].id
        )
      : null;

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
    job && job.name ? job.name : ""
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
    job && job.comments ? job.comments : ""
  );

  const {
    value: cost,
    isValid: inputIsValidCost,
    hasError: inputHasErrorCost,
    valueChangeHandler: inputChangeHandlerCost,
    inputBlurHandler: inputBlurHandlerCost,
    reset: inputResetCost,
  } = useInput(
    (value) => !isNaN(value) && value.trim() !== "", // validación actualizada
    null, // onChangeCallback
    job && job.labourCost ? job.labourCost.toString() : ""
  );

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleCancel = () => {
    navigate("/jobs"); // Reemplaza con la ruta deseada
  };

  const handleDelete = async () => {
    if (job && job.id) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que quieres eliminar esta obra?"
      );
      if (confirmDelete) {
        await removeData(urlJob, job.id);
        dispatch(fetchJobList());
        navigate("/jobs");
      }
    }
  };

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

        console.log("Valor de cost antes de la conversión: ", cost);
        formData.append("LabourCost", parseFloat(cost).toFixed(2));
        console.log(
          "Valor de LabourCost después de la conversión: ",
          parseFloat(cost).toFixed(2)
        );

        formData.append("EstateId", ddlSelectedEstate.id);
        formData.append(
          "ListWorkers",
          ddlSelectedWorker ? [ddlSelectedWorker] : []
        );

        console.log("Archivos cargados:", loadedPhotos);
        for (var pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        await uploadData(formData, urlJob, editMode, job?.id);
        dispatch(fetchJobList());

        setTimeout(() => {
          navigate("/jobs");
        }, 1000);
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
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
                    {editMode ? "Modificar la obra" : "Agregar una obra"}
                  </CCardTitle>
                </div>
                {editMode && job && job.id && (
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

export default JobABM;
