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

import { useSelector } from "react-redux";

import "./GroupInput.css";

const GroupInputSlate = (props) => {
  //#region Const ***********************************

  const [isValidForm, setIsValidForm] = useState(true); // Declarar e inicializar isValidForm
  const [ddlSelectedSlateProvince, setDdlSelectedSlateProvince] =
    useState(null);
  const [ddlSelectedSlateCandidate, setDdlSelectedSlateCandidate] =
    useState(null);
  const [inputHasError2, setInputHasError2] = useState(false);
  const [inputHasError3, setInputHasError3] = useState(false);
  const [color, setColor] = useState("#ffffff"); // Color inicial

  const { isLoading, isSuccess, uploadData } = useFirebase();
  const provinceList = useSelector((state) => state.generalData.provinceList);
  const candidateList = useSelector((state) => state.generalData.candidateList);

  //#endregion Const ***********************************

  //#region Functions ***********************************

  const {
    value: slateName,
    isValid: inputIsValid1,
    hasError: inputHasError1,
    valueChangeHandler: inputChangeHandler1,
    inputBlurHandler: inputBlurHandler1,
    reset: inputReset1,
  } = useInput((value) => value.trim() !== "");

  const inputReset2 = () => {
    setDdlSelectedSlateProvince(null);
    setInputHasError2(false);
  };

  const inputReset3 = () => {
    setDdlSelectedSlateCandidate(null);
    setInputHasError3(false);
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValid2 = ddlSelectedSlateProvince !== null;
    const inputIsValid3 = ddlSelectedSlateCandidate !== null;

    setIsValidForm(inputIsValid1 && inputIsValid2 && inputIsValid3);
    if (!inputIsValid2) {
      setInputHasError2(true);
      return;
    }

    if (!inputIsValid3) {
      setInputHasError3(true);
      return;
    }

    if (!isValidForm) return;

    const dataToUpload = await props.createDataToUpload(
      slateName,
      color,
      ddlSelectedSlateProvince.provinceId,
      ddlSelectedSlateCandidate.candidateId
    );

    await uploadData(
      dataToUpload,
      props.firebaseUrlFinal,
      props.firebaseUrlClean
    );

    inputReset1();
    inputReset2();
    inputReset3();
  };

  const handleSelectDdlSlateProvince = (item) => {
    setDdlSelectedSlateProvince(item);
  };

  const handleSelectDdlSlateCandidate = (item) => {
    setDdlSelectedSlateCandidate(item);
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
                {props.inputLabel}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler1}
                onBlur={inputBlurHandler1}
                value={slateName}
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
                {props.labelFkProvince}
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddlSlateProvince" color="secondary">
                  {ddlSelectedSlateProvince
                    ? ddlSelectedSlateProvince.provinceName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {provinceList.map((province, index) => (
                    <CDropdownItem
                      key={province.provinceId}
                      onClick={() => handleSelectDdlSlateProvince(province)}
                      style={{ cursor: "pointer" }}
                      value={province.provinceId}
                    >
                      {province.provinceName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              {/*  */}
              {inputHasError2 && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.labelFkCandidate}
              </CInputGroupText>
              {/*  */}
              <CDropdown>
                <CDropdownToggle
                  id="ddlSelectedSlateCandidate"
                  color="secondary"
                >
                  {ddlSelectedSlateCandidate
                    ? ddlSelectedSlateCandidate.candidateName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {candidateList.map((candidate, index) => (
                    <CDropdownItem
                      key={candidate.candidateId}
                      onClick={() => handleSelectDdlSlateCandidate(candidate)}
                      style={{ cursor: "pointer" }}
                      value={candidate.candidateId}
                    >
                      {candidate.candidateName}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
              {/*  */}
              {inputHasError2 && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
            <CInputGroup>
              <CInputGroupText>Color distintivo</CInputGroupText>
              <CFormInput
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
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

export default GroupInputSlate;
