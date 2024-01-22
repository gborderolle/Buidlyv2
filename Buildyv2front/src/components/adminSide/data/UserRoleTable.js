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
import { fetchUserRoleList } from "../../../store/generalData-actions";
import { urlUserRole } from "../../../endpoints";

const UserRoleTable = (props) => {
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
  const [currentCity, setCurrentCity] = useState(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [ddlSelectedUserRole, setDdlSelectedUserRole] = useState(null);
  const [inputHasErrorUserRole, setInputHasErrorUserRole] = useState(false);

  // redux
  const dispatch = useDispatch();

  // Redux
  const userRoleList = useSelector((state) => state.generalData.userRoleList);

  useEffect(() => {
    dispatch(fetchUserRoleList());
  }, [dispatch]);

  const {
    value: userName,
    isValid: inputIsValid1,
    hasError: inputHasError1,
    valueChangeHandler: inputChangeHandler1,
    inputBlurHandler: inputBlurHandler1,
    reset: inputReset1,
  } = useInput((value) => value.trim() !== "");

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  const openModal = (city = null) => {
    setCurrentCity(city);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentCity(null);
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
      await removeData(urlUserRole, idToDelete);
      dispatch(fetchUserRoleList());
      closeDeleteModal();
    }
  };

  const inputResetUserRole = () => {
    setDdlSelectedUserRole(null);
    setInputHasErrorUserRole(false);
  };

  const handleDelete = async (objectId) => {
    const response = await removeData(urlUserRole, objectId);
    if (response) {
      dispatch(fetchUserRoleList());
    }
    closeDeleteModal();
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidProvince = ddlSelectedUserRole !== null;
    if (!inputIsValidProvince) {
      setInputHasErrorUserRole(true);
      return;
    }

    setIsValidForm(inputIsValid1 && inputIsValid2);

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: userName,
      UserRoleId: ddlSelectedUserRole.id,
    };

    try {
      const response = await uploadData(dataToUpload, urlUserRole);
      if (response) {
        dispatch(fetchUserRoleList());
        inputReset1();
        inputReset2();
        inputResetUserRole();
        closeModal();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      // No cerrar el modal aquí, ya que se mostrará el error en él
    }
  };

  const handleSelectDdlUserRole = (item) => {
    setDdlSelectedUserRole(item);
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
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {userRoleList.map((userRole) => {
            return (
              <CTableRow key={userRole.id}>
                <CTableDataCell>{userRole.id}</CTableDataCell>
                <CTableDataCell>{userRole.name}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="dark"
                    size="sm"
                    onClick={() => openModal(userRole)}
                  >
                    Editar
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => openDeleteModal(userRole.id)}
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
            {currentCity ? "Editar rol de usuario" : "Agregar rol de usuario"}
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
                    value={userName}
                  />
                  {inputHasError1 && (
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
              {currentCity ? "Actualizar" : "Guardar"}
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

export default UserRoleTable;
