import React from "react";
import { useState } from "react";

import {
  CRow,
  CButton,
  CCardFooter,
  CSpinner,
  CCardTitle,
  CCardBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CForm,
  CCard,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from "@coreui/react";
import useInput from "../../../../hooks/use-input";
import useFirebase from "../../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";

import "./GroupInput.css";

const GroupInputUser = (props) => {
  //#region Consts ***********************************

  const [isValidForm, setIsValidForm] = useState(true); // Declarar e inicializar isValidForm
  const [ddlSelectedUserProvince, setDdlSelectUserProvince] = useState(null);
  const [ddlSelectedUserRole, setDdlSelectUserRole] = useState(null);

  const { isLoading, isSuccess, uploadData } = useFirebase();
  const [inputHasErrorProvince, setInputHasErrorProvince] = useState(false);
  const [inputHasErrorRole, setInputHasErrorRole] = useState(false);

  // Redux
  const provinceList = useSelector((state) => state.generalData.provinceList);
  const roleList = useSelector((state) => state.generalData.roleList);

  // Redux fetch DB
  const dispatch = useDispatch();

  const {
    value: userUsername,
    isValid: inputIsValid1,
    hasError: inputHasError1,
    valueChangeHandler: inputChangeHandler1,
    inputBlurHandler: inputBlurHandler1,
    reset: inputReset1,
  } = useInput((value) => value.trim() !== "");

  const {
    value: userFullname,
    isValid: inputIsValid2,
    hasError: inputHasError2,
    valueChangeHandler: inputChangeHandler2,
    inputBlurHandler: inputBlurHandler2,
    reset: inputReset2,
  } = useInput((value) => value.trim() !== "");

  const {
    value: userPassword,
    isValid: inputIsValid3,
    hasError: inputHasError3,
    valueChangeHandler: inputChangeHandler3,
    inputBlurHandler: inputBlurHandler3,
    reset: inputReset3,
  } = useInput((value) => value.trim() !== "");

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  const inputResetProvince = () => {
    setDdlSelectUserProvince(null);
    setInputHasErrorProvince(false);
  };

  const inputResetRole = () => {
    setDdlSelectUserRole(null);
    setInputHasErrorRole(false);
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidProvince = setDdlSelectUserProvince !== null;
    if (!inputIsValidProvince) {
      setInputHasErrorProvince(true);
      return;
    }

    const inputIsValidRole = setDdlSelectUserRole !== null;
    if (!inputIsValidRole) {
      setInputHasErrorRole(true);
      return;
    }

    setIsValidForm(
      inputIsValid1 &&
        inputIsValid2 &&
        inputIsValid3 &&
        inputIsValidProvince &&
        inputIsValidRole
    );

    if (!isValidForm) {
      return;
    }

    const dataToUpload = await props.createDataToUpload(
      userFullname,
      userUsername,
      userPassword,
      ddlSelectedUserProvince.provinceId,
      ddlSelectedUserRole.roleNumber
    );

    await uploadData(
      dataToUpload,
      props.firebaseUrlFinal,
      props.firebaseUrlClean
    );
    inputReset1();
    inputReset2();
    inputReset3();

    inputResetProvince();
    inputResetRole();
  };

  const handleSelectDdlUserProvince = (item) => {
    setDdlSelectUserProvince(item);
  };

  const handleSelectDdlUserRole = (item) => {
    setDdlSelectUserRole(item);
  };

  //#endregion Events ***********************************

  return (
    <CForm onSubmit={formSubmitHandler}>
      <CAccordion>
        <CAccordionItem itemKey={1}>
          <CAccordionHeader className="custom-accordion-header">
            {props.title}
          </CAccordionHeader>
          <CAccordionBody>
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.inputFullname}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler2}
                onBlur={inputBlurHandler2}
                value={userFullname}
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
                {props.inputUsername}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler1}
                onBlur={inputBlurHandler1}
                value={userUsername}
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
                {props.inputPassword}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler3}
                onBlur={inputBlurHandler3}
                value={userPassword}
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
                {props.labelFk}
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddlUserProvince" color="secondary">
                  {ddlSelectedUserProvince
                    ? ddlSelectedUserProvince.provinceName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {provinceList.map((province, index) => (
                    <CDropdownItem
                      key={province.provinceId}
                      onClick={() => handleSelectDdlUserProvince(province)}
                      style={{ cursor: "pointer" }}
                      value={province.provinceId}
                    >
                      {province.provinceName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              {/*  */}
              {inputHasErrorProvince && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />

            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.inputRole}
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddlUserRole" color="secondary">
                  {ddlSelectedUserRole
                    ? ddlSelectedUserRole.roleName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {roleList.map((role, index) => (
                    <CDropdownItem
                      key={role.roleId}
                      onClick={() => handleSelectDdlUserRole(role)}
                      style={{ cursor: "pointer" }}
                      value={role.roleId}
                    >
                      {role.roleName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              {/*  */}
              {inputHasErrorRole && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
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
            </CCardFooter>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CForm>
  );
};

export default GroupInputUser;
