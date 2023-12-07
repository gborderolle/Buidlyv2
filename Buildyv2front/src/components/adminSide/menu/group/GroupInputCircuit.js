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
import { fetchCircuitList } from "../../../../store/generalData-actions";

import "./GroupInput.css";

const GroupInputCircuit = (props) => {
  //#region Consts ***********************************

  const [isValidForm, setIsValidForm] = useState(true); // Declarar e inicializar isValidForm
  const [ddlSelectedCircuitProvince, setDdlSelectedCircuitProvince] =
    useState(null);
  const [ddlSelectedDelegadoMunicipality, setDdlSelectDelegadoMunicipality] =
    useState(null);

  const { isLoading, isSuccess, uploadData } = useFirebase();
  const [inputHasErrorProvince, setInputHasErrorProvince] = useState(false);
  const [inputHasErrorMunicipality, setInputHasErrorMunicipality] =
    useState(false);

  // Redux
  const provinceList = useSelector((state) => state.generalData.provinceList);
  const municipalityList = useSelector(
    (state) => state.generalData.municipalityList
  );

  // Redux fetch DB
  const dispatch = useDispatch();

  const {
    value: circuitName,
    isValid: inputIsValidName,
    hasError: inputHasErrorName,
    valueChangeHandler: inputChangeHandlerName,
    inputBlurHandler: inputBlurHandlerName,
    reset: inputResetName,
  } = useInput((value) => value.trim() !== "");

  const {
    value: circuitNumber,
    isValid: inputIsValidNumber,
    hasError: inputHasErrorNumber,
    valueChangeHandler: inputChangeHandlerNumber,
    inputBlurHandler: inputBlurHandlerNumber,
    reset: inputResetNumber,
  } = useInput((value) => value > 0);

  const {
    value: circuitLatLong,
    isValid: inputIsValidLatLong,
    hasError: inputHasErrorLatLong,
    valueChangeHandler: inputChangeHandlerLatLong,
    inputBlurHandler: inputBlurHandlerLatLong,
    reset: inputResetLatLong,
  } = useInput((value) => {
    const trimmedValue = value.trim();
    if (trimmedValue == "") {
      return true; // Ingreso vacío permitido
    }
    const regex = /^-?\d+\.\d+,\s*-?\d+\.\d+$/;
    return regex.test(trimmedValue); // Comprobar el patrón de latitud y longitud
  });

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  // Actualiza un elemento específico (party) en Firebase añadiendo un nuevo circuito
  const updatePartyWithNewCircuit = async (
    firebaseUrl,
    partyPushId,
    newCircuit,
    circuitPpushId
  ) => {
    const url = `${firebaseUrl}/${partyPushId}/circuitList/${circuitPpushId}.json`;

    const responseCircuit = await fetch(url, {
      method: "PUT", // Puedes usar PUT aquí porque estás creando una nueva clave
      body: JSON.stringify(newCircuit),
    });

    return await responseCircuit.json();
  };

  // Suponiendo que tienes una función que te devuelve todos los elementos de una lista en Firebase
  const getAllParties = async (firebaseUrl) => {
    const response = await fetch(firebaseUrl);
    const data = await response.json();
    return data;
  };

  const inputResetProvince = () => {
    setDdlSelectedCircuitProvince(null);
    setInputHasErrorProvince(false);
  };

  const inputResetMunicipality = () => {
    setDdlSelectDelegadoMunicipality(null);
    setInputHasErrorMunicipality(false);
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidProvince = ddlSelectedCircuitProvince !== null;

    if (!inputIsValidProvince) {
      setInputHasErrorProvince(true);
      return;
    }

    // Verificar si se seleccionó una provincia
    const inputIsValidMunicipality = setDdlSelectDelegadoMunicipality !== null;
    if (!inputIsValidMunicipality) {
      setInputHasErrorMunicipality(true);
      return;
    }

    setIsValidForm(
      inputIsValidName &&
        inputIsValidNumber &&
        inputIsValidProvince &&
        inputIsValidLatLong &&
        inputIsValidMunicipality
    );

    if (!isValidForm) {
      return;
    }

    const dataToUpload = await props.createDataToUpload(
      circuitName,
      circuitNumber,
      ddlSelectedCircuitProvince.provinceId,
      ddlSelectedDelegadoMunicipality.municipalityId,
      circuitLatLong
    );

    const newCircuit = await uploadData(
      dataToUpload,
      props.firebaseUrlFinal,
      props.firebaseUrlClean
    );
    if (newCircuit && newCircuit.pushId) {
      // Paso 2: Obtiene todos los partidos actuales
      const currentParties = await getAllParties(props.firebaseUrlFK + ".json");

      // Paso 3 y 4: Actualiza cada partido con el nuevo circuito
      for (const partyPushId in currentParties) {
        // Crear el nuevo circuito con la información necesaria
        const newCircuitObject = {
          circuitId: dataToUpload.circuitId,
          circuitName: dataToUpload.circuitName,
          circuitNumber: Number(dataToUpload.circuitNumber),
          circuitVotes: 0,
          circuitPushId: newCircuit.pushId,
          provinceId: Number(dataToUpload.provinceId),
          municipalityId: Number(dataToUpload.municipalityId),
        };

        await updatePartyWithNewCircuit(
          props.firebaseUrlFK,
          partyPushId,
          newCircuitObject,
          newCircuit.pushId
        );
      }
    }

    // Redux fetch DB
    dispatch(fetchCircuitList()); // refresh DB data

    inputResetName();
    inputResetNumber();
    inputResetProvince();
    inputResetMunicipality();
    inputResetLatLong();
  };

  const handleSelectDdlCircuitProvince = (item) => {
    setDdlSelectedCircuitProvince(item);
  };

  const handleSelectDdlDelegadoMunicipality = (item) => {
    setDdlSelectDelegadoMunicipality(item);
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
                {props.inputLabel}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandlerName}
                onBlur={inputBlurHandlerName}
                value={circuitName}
              />
              {inputHasErrorName && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.inputNumberLabel}
              </CInputGroupText>
              <CFormInput
                type="number"
                className="cardItem"
                onChange={inputChangeHandlerNumber}
                onBlur={inputBlurHandlerNumber}
                value={circuitNumber}
              />
              {inputHasErrorNumber && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />

            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.labelFk1}
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddlCircuitProvince" color="secondary">
                  {ddlSelectedCircuitProvince
                    ? ddlSelectedCircuitProvince.provinceName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {provinceList.map((province, index) => (
                    <CDropdownItem
                      key={province.provinceId}
                      onClick={() => handleSelectDdlCircuitProvince(province)}
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
                {props.labelFk2}
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddlDelegadoMunicipality" color="secondary">
                  {ddlSelectedDelegadoMunicipality
                    ? ddlSelectedDelegadoMunicipality.municipalityName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {municipalityList.map((municipality, index) => (
                    <CDropdownItem
                      key={municipality.municipalityId}
                      onClick={() =>
                        handleSelectDdlDelegadoMunicipality(municipality)
                      }
                      style={{ cursor: "pointer" }}
                      value={municipality.municipalityId}
                    >
                      {municipality.municipalityName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              {/*  */}
              {inputHasErrorMunicipality && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.labelLatLong}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandlerLatLong}
                onBlur={inputBlurHandlerLatLong}
                value={circuitLatLong}
              />
              {inputHasErrorLatLong && (
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

export default GroupInputCircuit;
