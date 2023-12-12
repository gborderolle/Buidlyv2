import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  CDropdownToggle,
  CDropdownMenu,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from "@coreui/react";
import useInput from "../../../hooks/use-input";
import useAPI from "../../../hooks/use-API";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchEstateList } from "../../../store/generalData-actions";
import { urlEstate } from "../../../endpoints";
import { authActions } from "../../../store/auth-slice";

const EstateCreate = () => {
  //#region Const ***********************************

  const [isValidForm, setIsValidForm] = useState(true);
  const { isLoading, isSuccess, error, uploadData } = useAPI();

  const [ddlSelectedCountry, setDdlSelectedCountry] = useState(null);
  const [ddlSelectedProvince, setDdlSelectedProvince] = useState(null);
  const [ddlSelectedCity, setDdlSelectedCity] = useState(null);

  const [inputHasErrorCountry, setInputHasErrorCountry] = useState(false);
  const [inputHasErrorProvince, setInputHasErrorProvince] = useState(false);
  const [inputHasErrorCity, setInputHasErrorCity] = useState(false);

  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showAddProvinceModal, setShowAddProvinceModal] = useState(false);
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);

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
  const cityList = useSelector((state) => state.generalData.cityList);
  const provinceList = useSelector((state) => state.generalData.provinceList);
  const countryList = useSelector((state) => state.generalData.countryList);

  const {
    value: estateName,
    isValid: inputIsValidName,
    hasError: inputHasErrorName,
    valueChangeHandler: inputChangeHandlerName,
    inputBlurHandler: inputBlurHandlerName,
    reset: inputResetName,
  } = useInput((value) => value.trim() !== "");

  const {
    value: estateAddress,
    isValid: inputIsValidAddress,
    hasError: inputHasErrorAddress,
    valueChangeHandler: inputChangeHandlerAddress,
    inputBlurHandler: inputBlurHandlerAddress,
    reset: inputResetAddress,
  } = useInput((value) => value.trim() !== "");

  const {
    value: estateComments,
    isValid: inputIsValidComments,
    hasError: inputHasErrorComments,
    valueChangeHandler: inputChangeHandlerComments,
    inputBlurHandler: inputBlurHandlerComments,
    reset: inputResetComments,
  } = useInput((value) => value.trim() !== "");

  const {
    value: cityName,
    isValid: inputIsValidCityName,
    hasError: inputHasErrorCityName,
    valueChangeHandler: inputChangeHandlerCityName,
    inputBlurHandler: inputBlurHandlerCityName,
    reset: inputResetCityName,
  } = useInput((value) => value.trim() !== "");
  const {
    value: provinceName,
    isValid: inputIsValidProvinceName,
    hasError: inputHasErrorProvinceName,
    valueChangeHandler: inputChangeHandlerProvinceName,
    inputBlurHandler: inputBlurHandlerProvinceName,
    reset: inputResetProvinceName,
  } = useInput((value) => value.trim() !== "");
  const {
    value: countryName,
    isValid: inputIsValidCountryName,
    hasError: inputHasErrorCountryName,
    valueChangeHandler: inputChangeHandlerCountryName,
    inputBlurHandler: inputBlurHandlerCountryName,
    reset: inputResetCountryName,
  } = useInput((value) => value.trim() !== "");

  const handleOpenAddCityModal = () => setShowAddCityModal(true);
  const handleCloseAddCityModal = () => setShowAddCityModal(false);

  const handleOpenAddProvinceModal = () => setShowAddProvinceModal(true);
  const handleCloseAddProvinceModal = () => setShowAddProvinceModal(false);

  const handleOpenAddCountryModal = () => setShowAddCountryModal(true);
  const handleCloseAddCountryModal = () => setShowAddCountryModal(false);

  //#endregion Const ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidCity = ddlSelectedCity !== null;
    if (!inputIsValidCity) {
      setInputHasErrorCity(true);
      return;
    }

    setIsValidForm(
      inputIsValidName &&
        inputIsValidAddress &&
        inputIsValidComments &&
        inputIsValidCity
    );

    if (!isValidForm) {
      return;
    }

    const dataToUpload = {
      Name: estateName,
      Address: estateAddress,
      Comments: estateComments,
      CityId: ddlSelectedCity.cityId,
    };

    try {
      await uploadData(dataToUpload, urlEstate);
      dispatch(fetchEstateList());

      inputResetName();
      inputResetAddress();
      inputResetComments();
      inputResetCity();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const handleSelectDdlCity = (item) => {
    setDdlSelectedCity(item);
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************
  const inputResetCountry = () => {
    setDdlSelectedCountry(null);
    setInputHasErrorCountry(false);
  };

  const inputResetCity = () => {
    setDdlSelectedCity(null);
    setInputHasErrorCity(false);
  };

  const inputResetProvince = () => {
    setDdlSelectedProvince(null);
    setInputHasErrorProvince(false);
  };

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <CForm onSubmit={formSubmitHandler}>
          <CCard>
            <CCardBody>
              <CCardTitle>Agregar una propiedad</CCardTitle>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Nombre propiedad
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerName}
                  onBlur={inputBlurHandlerName}
                  value={estateName}
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
                  Dirección
                </CInputGroupText>
                <CFormInput
                  type="text"
                  className="cardItem"
                  onChange={inputChangeHandlerAddress}
                  onBlur={inputBlurHandlerAddress}
                  value={estateAddress}
                />
                {inputHasErrorAddress && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
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
                  value={estateComments}
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
                  Ciudad
                </CInputGroupText>
                {/*  */}
                <CDropdown>
                  <CDropdownToggle id="ddCity" color="secondary">
                    {ddlSelectedCity ? ddlSelectedCity.cityName : "Seleccionar"}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {cityList &&
                      cityList.length > 0 &&
                      cityList.map((city) => (
                        <CDropdownItem
                          key={city.cityId}
                          onClick={() => handleSelectDdlCity(city)}
                          style={{ cursor: "pointer" }}
                          value={city.cityId}
                        >
                          {city.cityName}
                        </CDropdownItem>
                      ))}
                  </CDropdownMenu>
                </CDropdown>
                <CButton onClick={handleOpenAddCityModal} color="primary">
                  Agregar
                </CButton>

                {/*  */}
                {inputHasErrorCity && (
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
                {error && (
                  <CAlert color="danger" className="w-100">
                    {error}
                  </CAlert>
                )}
              </CCardFooter>
            </CCardBody>
          </CCard>
        </CForm>
        <br />
        <br />

        {/* Modal para agregar ciudad */}
        <CModal visible={showAddCityModal} onClose={handleCloseAddCityModal}>
          <CModalHeader>
            <CModalTitle>Nueva ciudad</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                Nombre ciudad
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandlerCityName}
                onBlur={inputBlurHandlerCityName}
                value={cityName}
              />
              {inputHasErrorCity && (
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
                <CDropdownToggle id="ddProvince" color="secondary">
                  {ddlSelectedProvince
                    ? ddlSelectedProvince.provinceName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {provinceList &&
                    provinceList.length > 0 &&
                    provinceList.map((province) => (
                      <CDropdownItem
                        key={province.provinceId}
                        onClick={() => handleSelectDdlProvince(province)}
                        style={{ cursor: "pointer" }}
                        value={province.provinceId}
                      >
                        {province.provinceName}
                      </CDropdownItem>
                    ))}
                </CDropdownMenu>
              </CDropdown>
              <CButton onClick={handleOpenAddProvinceModal} color="primary">
                Agregar
              </CButton>

              {/*  */}
              {inputHasErrorProvince && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary">Guardar</CButton>
            <CButton color="secondary" onClick={handleCloseAddCityModal}>
              Cancelar
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Modal para agregar departamento */}
        <CModal
          visible={showAddProvinceModal}
          onClose={handleCloseAddProvinceModal}
        >
          <CModalHeader>
            <CModalTitle>Nuevo departamento</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                Nombre departamento
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandlerProvinceName}
                onBlur={inputBlurHandlerProvinceName}
                value={provinceName}
              />
              {inputHasErrorProvince && (
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
              {/*  */}
              <CDropdown>
                <CDropdownToggle id="ddCountry" color="secondary">
                  {ddlSelectedCountry
                    ? ddlSelectedCountry.countryName
                    : "Seleccionar"}
                </CDropdownToggle>
                <CDropdownMenu>
                  {countryList &&
                    countryList.length > 0 &&
                    countryList.map((country) => (
                      <CDropdownItem
                        key={country.countryId}
                        onClick={() => handleSelectDdlCountry(country)}
                        style={{ cursor: "pointer" }}
                        value={country.countryId}
                      >
                        {country.countryName}
                      </CDropdownItem>
                    ))}
                </CDropdownMenu>
              </CDropdown>
              <CButton onClick={handleOpenAddCountryModal} color="primary">
                Agregar
              </CButton>

              {/*  */}
              {inputHasErrorCountry && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary">Guardar</CButton>
            <CButton color="secondary" onClick={handleCloseAddProvinceModal}>
              Cancelar
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Modal para agregar país */}
        <CModal
          visible={showAddCountryModal}
          onClose={handleCloseAddCountryModal}
        >
          <CModalHeader>
            <CModalTitle>Nuevo país</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                Nombre país
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandlerCountryName}
                onBlur={inputBlurHandlerCountryName}
                value={countryName}
              />
              {inputHasErrorCountry && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
          </CModalBody>
          <CModalFooter>
            <CButton color="primary">Guardar</CButton>
            <CButton color="secondary" onClick={handleCloseAddCountryModal}>
              Cancelar
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  );
};

export default EstateCreate;
