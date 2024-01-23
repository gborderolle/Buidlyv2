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
  fetchUserList,
  fetchUserRole,
  fetchUserRoleList,
} from "../../../store/generalData-actions";
import {
  urlAccount,
  urlAccountRegister,
  urlAccountUpdateUser,
} from "../../../endpoints";

const UserTable = (props) => {
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
  const [currentUser, setCurrentUser] = useState(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [ddlSelectedUserRole, setDdlSelectedUserRole] = useState(null);
  const [inputHasErrorUserRole, setInputHasErrorUserRole] = useState(false);

  const [userRoles, setUserRoles] = useState({});

  // redux
  const dispatch = useDispatch();

  // Redux
  const userList = useSelector((state) => state.generalData.userList);
  const userRoleList = useSelector((state) => state.generalData.userRoleList);

  useEffect(() => {
    dispatch(fetchUserList());
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

  const {
    value: email,
    isValid: inputIsValid2,
    hasError: inputHasError2,
    valueChangeHandler: inputChangeHandler2,
    inputBlurHandler: inputBlurHandler2,
    reset: inputReset2,
  } = useInput((value) => value.trim() !== "");

  const {
    value: password,
    isValid: inputIsValid3,
    hasError: inputHasError3,
    valueChangeHandler: inputChangeHandler3,
    inputBlurHandler: inputBlurHandler3,
    reset: inputReset3,
  } = useInput((value) => value.trim() !== "");

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    userList.forEach((user) => {
      dispatch(fetchUserRole(user.id)).then((role) => {
        setUserRoles((prevRoles) => ({ ...prevRoles, [user.id]: role }));
      });
    });
  }, [userList, dispatch]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const openModal = (user = null) => {
    setCurrentUser(user);
    if (user) {
      // Establece los valores iniciales directamente
      inputReset1(user.name);
      inputReset2(user.email);
      const userRoleName = userRoles[user.id][0]; // Obtén el nombre del rol del usuario
      const role = userRoleList.find((r) => r.name === userRoleName);
      setDdlSelectedUserRole(role || null); // Establece el rol en el DDL o null si no se encuentra
    } else {
      // Resetea los campos si es un nuevo usuario
      inputReset1();
      inputReset2();
      inputReset3();
      setDdlSelectedUserRole(null);
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
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
      await removeData(urlAccount, idToDelete);
      dispatch(fetchUserList());
      closeDeleteModal();
    }
  };

  const inputResetUserRole = () => {
    setDdlSelectedUserRole(null);
    setInputHasErrorUserRole(false);
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const inputIsValidUserRole = ddlSelectedUserRole !== null;
    if (!inputIsValidUserRole) {
      setInputHasErrorUserRole(true);
      return;
    }

    setIsValidForm(inputIsValid1 && inputIsValid2 && inputIsValid3);

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: userName,
      Email: email,
      Password: password,
      UserRoleId: ddlSelectedUserRole.id,
      UserRoleName: ddlSelectedUserRole.name,
    };

    try {
      let response;
      if (currentUser) {
        response = await uploadData(
          dataToUpload,
          urlAccountUpdateUser,
          true,
          currentUser.id
        );
      } else {
        response = await uploadData(dataToUpload, urlAccountRegister);
      }
      if (response) {
        dispatch(fetchUserList());
        inputReset1();
        inputReset2();
        inputResetUserRole();
        closeModal();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
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
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Rol</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {userList.map((user, index) => {
            return (
              <CTableRow key={user.id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>
                  {userRoles[user.id] ? (
                    userRoles[user.id]
                  ) : (
                    <CSpinner size="sm" />
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="dark"
                    size="sm"
                    onClick={() => openModal(user)}
                  >
                    Editar
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => openDeleteModal(user.id)}
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
            {currentUser ? "Editar usuario" : "Agregar usuario"}
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
                <CInputGroup>
                  <CInputGroupText className="cardItem custom-input-group-text">
                    {props.email}
                  </CInputGroupText>
                  <CFormInput
                    type="email"
                    className="cardItem"
                    onChange={inputChangeHandler2}
                    onBlur={inputBlurHandler2}
                    value={email}
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
                    {props.password}
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    className="cardItem"
                    onChange={inputChangeHandler3}
                    onBlur={inputBlurHandler3}
                    value={password}
                  />
                  {inputHasError3 && (
                    <CAlert color="danger" className="w-100">
                      Entrada inválida
                    </CAlert>
                  )}
                </CInputGroup>
                <br />
                <CInputGroup>
                  <CInputGroupText className="cardItem custom-input-group-text">
                    Rol de usuario
                  </CInputGroupText>
                  <CDropdown>
                    <CDropdownToggle id="ddlUserRole" color="secondary">
                      {ddlSelectedUserRole
                        ? ddlSelectedUserRole.name
                        : "Seleccionar"}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {userRoleList &&
                        userRoleList.length > 0 &&
                        userRoleList.map((userRole) => (
                          <CDropdownItem
                            key={userRole.id}
                            onClick={() => handleSelectDdlUserRole(userRole)}
                            style={{ cursor: "pointer" }}
                            value={userRole.id}
                          >
                            {userRole.name}
                          </CDropdownItem>
                        ))}
                    </CDropdownMenu>
                  </CDropdown>
                  {inputHasErrorUserRole && (
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
              {currentUser ? "Actualizar" : "Guardar"}
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

export default UserTable;
