import React, { useState, useEffect } from "react";
import {
  CSpinner,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormInput,
  CModalFooter,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardFooter,
  CAlert,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";
import useAPI from "../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchCountryList } from "../../../store/generalData-actions";
import { urlCountry } from "../../../endpoints";

const CountryTable = (props) => {
  //#region Consts ***********************************

  const [isValidForm, setIsValidForm] = useState(true);
  const {
    isLoading,
    isSuccess,
    error: errorAPI,
    uploadData,
    removeData,
  } = useAPI();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  // redux
  const dispatch = useDispatch();

  // Redux
  const countryList = useSelector((state) => state.generalData.countryList);

  useEffect(() => {
    dispatch(fetchCountryList());
    dispatch(fetchCountryList());
  }, [dispatch]);

  const {
    value: countryName,
    isValid: inputIsValid1,
    hasError: inputHasError1,
    valueChangeHandler: inputChangeHandler1,
    inputBlurHandler: inputBlurHandler1,
    reset: inputReset1,
  } = useInput((value) => value.trim() !== "");

  const {
    value: nominatimCode,
    isValid: inputIsValid2,
    hasError: inputHasError2,
    valueChangeHandler: inputChangeHandler2,
    inputBlurHandler: inputBlurHandler2,
    reset: inputReset2,
  } = useInput((value) => true);

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  const openModal = (country = null) => {
    setCurrentCountry(country);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentCountry(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setIdToDelete(null);
  };

  const openDeleteModal = (id) => {
    setIdToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      await removeData(urlCountry, idToDelete);
      dispatch(fetchCountryList());
      closeDeleteModal();
    }
  };

  const handleDelete = async (objectId) => {
    const response = await removeData(urlCountry, objectId);
    if (response) {
      dispatch(fetchCountryList());
    }
    closeDeleteModal();
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    setIsValidForm(inputIsValid1 && inputIsValid2);

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: countryName,
      NominatimCountryCode: nominatimCode,
    };

    try {
      const response = await uploadData(dataToUpload, urlCountry);
      if (response) {
        dispatch(fetchCountryList());
        inputReset1();
        inputReset2();
        closeModal();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      // No cerrar el modal aquí, ya que se mostrará el error en él
    }
  };

  //#endregion Events ***********************************

  return (
    <div>
      <CButton color="dark" size="sm" onClick={() => openModal()}>
        Agregar
      </CButton>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Código nominatim</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {countryList.map((country) => (
            <CTableRow key={country.id}>
              <CTableDataCell>{country.id}</CTableDataCell>
              <CTableDataCell>{country.name}</CTableDataCell>
              <CTableDataCell>{country.nominatimCountryCode}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="dark"
                  size="sm"
                  onClick={() => openModal(country)}
                >
                  Editar
                </CButton>
                <CButton
                  color="danger"
                  size="sm"
                  onClick={() => openDeleteModal(country.id)}
                  style={{ marginLeft: 10 }}
                >
                  Eliminar
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={isModalVisible} onClose={closeModal}>
        <CModalHeader>
          <CModalTitle>
            {currentCountry ? "Editar país" : "Agregar país"}
          </CModalTitle>
        </CModalHeader>
        <CForm onSubmit={formSubmitHandler}>
          <CModalBody>
            <CCard>
              <CCardBody>
                <CInputGroup>
                  <CInputGroupText className="cardItem custom-input-group-text">
                    {props.inputName}
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    className="cardItem"
                    onChange={inputChangeHandler1}
                    onBlur={inputBlurHandler1}
                    value={countryName}
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
                    {props.nominatimCode}
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    className="cardItem"
                    onChange={inputChangeHandler2}
                    onBlur={inputBlurHandler2}
                    value={nominatimCode}
                  />
                  {inputHasError2 && (
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
          </CModalBody>
          <CModalFooter>
            <CButton type="submit" color="dark" size="sm">
              {currentCountry ? "Actualizar" : "Guardar"}
            </CButton>
            <CButton color="secondary" size="sm" onClick={closeModal}>
              Cancelar
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal visible={isDeleteModalVisible} onClose={closeDeleteModal}>
        <CModalHeader>
          <CModalTitle>Confirmar</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Estás seguro de que deseas eliminar este elemento?
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" size="sm" onClick={confirmDelete}>
            Eliminar
          </CButton>
          <CButton color="secondary" size="sm" onClick={closeDeleteModal}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CountryTable;
