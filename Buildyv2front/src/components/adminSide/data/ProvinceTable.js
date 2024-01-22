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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCard,
  CCardBody,
  CCardFooter,
  CAlert,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";
import useAPI from "../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProvinceList,
  fetchCountryList,
} from "../../../store/generalData-actions";
import { urlProvince } from "../../../endpoints";

const ProvinceTable = (props) => {
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
  const [currentProvince, setCurrentProvince] = useState(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [ddlSelectedCountry, setDdlSelectedCountry] = useState(null);
  const [inputHasErrorCountry, setInputHasErrorCountry] = useState(false);

  // redux
  const dispatch = useDispatch();

  // Redux
  const provinceList = useSelector((state) => state.generalData.provinceList);
  const countryList = useSelector((state) => state.generalData.countryList);

  useEffect(() => {
    dispatch(fetchProvinceList());
    dispatch(fetchCountryList());
  }, [dispatch]);

  const {
    value: provinceName,
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

  const openModal = (province = null) => {
    setCurrentProvince(province);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentProvince(null);
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
      await removeData(urlProvince, idToDelete);
      dispatch(fetchProvinceList());
      closeDeleteModal();
    }
  };

  const inputResetProvince = () => {
    setDdlSelectedCountry(null);
    setInputHasErrorCountry(false);
  };

  const handleDelete = async (objectId) => {
    const response = await removeData(urlProvince, objectId);
    if (response) {
      dispatch(fetchProvinceList());
    }
    closeDeleteModal();
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidCountry = ddlSelectedCountry !== null;
    if (!inputIsValidCountry) {
      setInputHasErrorCountry(true);
      return;
    }

    setIsValidForm(inputIsValid1 && inputIsValid2);

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: provinceName,
      NominatimProvinceCode: nominatimCode,
      CountryDSId: ddlSelectedCountry.id,
    };

    try {
      const response = await uploadData(dataToUpload, urlProvince);
      if (response) {
        dispatch(fetchProvinceList());
        inputReset1();
        inputReset2();
        inputResetProvince();
        closeModal();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      // No cerrar el modal aquí, ya que se mostrará el error en él
    }
  };

  const handleSelectDdlCountry = (item) => {
    setDdlSelectedCountry(item);
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
            <CTableHeaderCell>País</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {provinceList.map((province) => {
            const country = countryList.find(
              (countryItem) => countryItem.id === province.countryDSId
            );
            const countryName = country ? country.name : "No definido";

            return (
              <CTableRow key={province.id}>
                <CTableDataCell>{province.id}</CTableDataCell>
                <CTableDataCell>{province.name}</CTableDataCell>
                <CTableDataCell>
                  {province.nominatimProvinceCode}
                </CTableDataCell>
                <CTableDataCell>{countryName}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="dark"
                    size="sm"
                    onClick={() => openModal(province)}
                  >
                    Editar
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => openDeleteModal(province.id)}
                    style={{ marginLeft: 10 }}
                  >
                    Eliminar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>

      <CModal visible={isModalVisible} onClose={closeModal}>
        <CModalHeader>
          <CModalTitle>
            {currentProvince ? "Editar departamento" : "Agregar departamento"}
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
                <CInputGroup>
                  <CInputGroupText className="cardItem custom-input-group-text">
                    País
                  </CInputGroupText>
                  <CDropdown>
                    <CDropdownToggle id="ddlProvince" color="secondary">
                      {ddlSelectedCountry
                        ? ddlSelectedCountry.name
                        : "Seleccionar"}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {countryList &&
                        countryList.length > 0 &&
                        countryList.map((country) => (
                          <CDropdownItem
                            key={country.id}
                            onClick={() => handleSelectDdlCountry(country)}
                            style={{ cursor: "pointer" }}
                            value={country.id}
                          >
                            {country.id}: {country.name}
                          </CDropdownItem>
                        ))}
                    </CDropdownMenu>
                  </CDropdown>
                  {inputHasErrorCountry && (
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
              {currentProvince ? "Actualizar" : "Guardar"}
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

export default ProvinceTable;
