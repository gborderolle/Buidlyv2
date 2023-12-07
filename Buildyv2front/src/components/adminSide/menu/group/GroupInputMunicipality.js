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
import useFirebase from "../../../../hooks/use-firebase";

// redux imports
import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchMunicipalityList,
//   fetchProvinceList,
// } from "../../../../store/generalData-actions";

import "./GroupInput.css";

const GroupInputMunicipality = (props) => {
  //#region Consts ***********************************

  const [isValidForm, setIsValidForm] = useState(true); // Declarar e inicializar isValidForm
  const [ddlSelectedMunicipalityProvince, setDdlSelectedMunicipalityProvince] =
    useState(null);

  const { isLoading, isSuccess, uploadData } = useFirebase();
  const [inputHasErrorProvince, setInputHasErrorProvince] = useState(false);

  // Redux
  const provinceList = useSelector((state) => state.generalData.provinceList);

  // Redux fetch DB
  const dispatch = useDispatch();

  const {
    value: municipalityName,
    isValid: inputIsValid1,
    hasError: inputHasError1,
    valueChangeHandler: inputChangeHandler1,
    inputBlurHandler: inputBlurHandler1,
    reset: inputReset1,
  } = useInput((value) => value.trim() !== "");

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  const inputResetProvince = () => {
    setDdlSelectedMunicipalityProvince(null);
    setInputHasErrorProvince(false);
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidProvince = setDdlSelectedMunicipalityProvince !== null;
    if (!inputIsValidProvince) {
      setInputHasErrorProvince(true);
      return;
    }

    setIsValidForm(inputIsValid1 && inputIsValidProvince); // Actualizar la validez del formulario

    if (!isValidForm) {
      return;
    }

    const dataToUpload = await props.createDataToUpload(
      municipalityName,
      ddlSelectedMunicipalityProvince.provinceId
    );

    await uploadData(
      dataToUpload,
      props.firebaseUrlFinal,
      props.firebaseUrlClean
    );

    // Redux fetch DB
    // dispatch(fetchMunicipalityList()); // refresh DB data

    inputReset1();
    inputResetProvince();
  };

  const handleSelectDdlMunicipalityProvince = (item) => {
    setDdlSelectedMunicipalityProvince(item);
  };
  //#endregion Events ***********************************

  return (
    <CForm onSubmit={formSubmitHandler}>
      <CAccordion>
        <CAccordionItem itemKey={1}>
          <CAccordionHeader className="custom-accordion-header header-excel">
            {props.title}
          </CAccordionHeader>
          <CAccordionBody>
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.labelName}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler1}
                onBlur={inputBlurHandler1}
                value={municipalityName}
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
                {props.labelFk}
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddlMunicipalityProvince" color="secondary">
                  {ddlSelectedMunicipalityProvince
                    ? ddlSelectedMunicipalityProvince.provinceName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {provinceList.map((province, index) => (
                    <CDropdownItem
                      key={province.provinceId}
                      onClick={() =>
                        handleSelectDdlMunicipalityProvince(province)
                      }
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

export default GroupInputMunicipality;
