import React from "react";
import { useState } from "react";

import {
  CRow,
  CButton,
  CCardFooter,
  CSpinner,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CForm,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";
import useAPI from "../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchCityList } from "../../../store/generalData-actions";
import { urlCity } from "../../../endpoints";

import "./GroupInput.css";

const GroupInputCity = (props) => {
  //#region Consts ***********************************

  const [isValidForm, setIsValidForm] = useState(true); // Declarar e inicializar isValidForm
  const { isLoading, isSuccess, error: errorAPI, uploadData } = useAPI();

  const [ddlSelectedProvince, setDdlSelectedProvince] = useState(null);
  const [inputHasErrorProvince, setInputHasErrorProvince] = useState(false);

  // Redux fetch DB
  const dispatch = useDispatch();

  // Redux
  const provinceList = useSelector((state) => state.generalData.provinceList);

  const {
    value: cityName,
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

  const handleCancel = () => {
    navigate("/workers"); // Reemplaza con la ruta deseada
  };

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  const inputResetProvince = () => {
    setDdlSelectedProvince(null);
    setInputHasErrorProvince(false);
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidProvince = ddlSelectedProvince !== null;
    if (!inputIsValidProvince) {
      setInputHasErrorProvince(true);
      return;
    }

    setIsValidForm(inputIsValid1 && inputIsValid2);

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: cityName,
      NominatimCityCode: nominatimCode,
      ProvinceDSId: ddlSelectedProvince.id,
    };

    try {
      await uploadData(dataToUpload, urlCity);
      dispatch(fetchCityList());

      inputReset1();
      inputReset2();
      inputResetProvince();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleSelectDdlProvince = (item) => {
    setDdlSelectedProvince(item);
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
                {props.inputName}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler1}
                onBlur={inputBlurHandler1}
                value={cityName}
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
                Departamento
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddlProvince" color="secondary">
                  {ddlSelectedProvince
                    ? ddlSelectedProvince.name
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {provinceList &&
                    provinceList.length > 0 &&
                    provinceList.map((province) => (
                      <CDropdownItem
                        key={province.id}
                        onClick={() => handleSelectDdlProvince(province)}
                        style={{ cursor: "pointer" }}
                        value={province.id}
                      >
                        {province.id}: {province.name}
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
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CForm>
  );
};

export default GroupInputCity;
