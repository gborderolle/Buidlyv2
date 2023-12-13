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
  CDropdownItem,
  CDropdownToggle,
  CDropdownMenu,
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
  const { isLoading, isSuccess, error: errorAPI, uploadData } = useAPI();

  const [ddlSelectedCity, setDdlSelectedCity] = useState(null);
  const [inputHasErrorCity, setInputHasErrorCity] = useState(false);

  const [latLong, setLatLong] = useState({ lat: null, lon: null });

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
  } = useInput(() => true); // No se necesita

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

    await verifyAddress(); // Verificar dirección y obtener latitud y longitud
    console.log("latLong después de verifyAddress:", latLong);

    const dataToUpload = {
      Name: estateName,
      Address: estateAddress,
      Comments: estateComments,
      CityDSId: ddlSelectedCity.id,
      LatLong: `${latLong.lat},${latLong.lon}`,
      GoogleMapsURL: `https://www.google.com/maps/search/${latLong.lat},${latLong.lon}`,
    };
    console.log("dataToUpload:", dataToUpload);

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
  const inputResetCity = () => {
    setDdlSelectedCity(null);
    setInputHasErrorCity(false);
  };

  const verifyAddress = () => {
    return new Promise(async (resolve, reject) => {
      if (!ddlSelectedCity) {
        console.error("Ciudad no seleccionada");
        reject("Ciudad no seleccionada");
        return;
      }

      let citycode = ddlSelectedCity.nominatimCityCode;
      let countrycode = "";
      const selectedProvince = provinceList.find(
        (p) => p.id === ddlSelectedCity.provinceDSId
      );
      if (selectedProvince) {
        const selectedCountry = countryList.find(
          (c) => c.id === selectedProvince.countryDSId
        );
        if (selectedCountry) {
          countrycode = selectedCountry.nominatimCountryCode;
        }
      }

      if (!citycode || !countrycode) {
        console.error("Códigos de ciudad o país no encontrados");
        reject("Códigos de ciudad o país no encontrados");
        return;
      }

      try {
        const query = `${estateAddress}, ${citycode}, ${countrycode}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&citycode=${encodeURIComponent(
          citycode
        )}&countrycode=${encodeURIComponent(
          countrycode
        )}&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json();
        if (data.length === 0) {
          reject("Dirección no encontrada.");
          return;
        }
        const { lat, lon } = data[0];
        console.log("Coordenadas obtenidas:", lat, lon);

        setLatLong({ lat, lon });
        resolve({ lat, lon });
      } catch (error) {
        console.error("Error al verificar la dirección:", error);
        reject(error);
      }
    });
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
                    {ddlSelectedCity ? ddlSelectedCity.name : "Seleccionar"}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {cityList &&
                      cityList.length > 0 &&
                      cityList.map((city) => (
                        <CDropdownItem
                          key={city.id}
                          onClick={() => handleSelectDdlCity(city)}
                          style={{ cursor: "pointer" }}
                          value={city.id}
                        >
                          {city.id}: {city.name}
                        </CDropdownItem>
                      ))}
                  </CDropdownMenu>
                </CDropdown>

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
                {errorAPI && (
                  <CAlert color="danger" className="w-100">
                    {errorAPI}
                  </CAlert>
                )}
              </CCardFooter>
            </CCardBody>
          </CCard>
        </CForm>
        <br />
        <br />
      </CCol>
    </CRow>
  );
};

export default EstateCreate;
