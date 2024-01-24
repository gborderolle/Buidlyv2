import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

const EstateABM = () => {
  //#region Const ***********************************

  const location = useLocation();
  const estate = location.state?.estate;
  const editMode = location.state?.editMode ? location.state?.editMode : false;

  const [isValidForm, setIsValidForm] = useState(true);
  const {
    isLoading,
    isSuccess,
    error: errorAPI,
    uploadData,
    removeData,
  } = useAPI();

  const [inputHasErrorCity, setInputHasErrorCity] = useState(false);
  const [inputHasErrorOwner, setInputHasErrorOwner] = useState(false);

  const [latLong, setLatLong] = useState({ lat: null, lon: null });
  const [addressError, setAddressError] = useState("");

  // redux
  const dispatch = useDispatch();

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const username = useSelector((state) => state.auth.username);
  useEffect(() => {
    if (!username) {
      dispatch(authActions.logout());
      navigate("/login");
    }
  }, [username, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  // Redux
  const cityList = useSelector((state) => state.generalData.cityList);
  const provinceList = useSelector((state) => state.generalData.provinceList);
  const countryList = useSelector((state) => state.generalData.countryList);
  const ownerList = useSelector((state) => state.generalData.ownerList);

  const defaultCityId = estate?.cityDS?.id || null;
  const defaultCity = cityList.find((city) => city.id === defaultCityId);
  const [ddlSelectedCity, setDdlSelectedCity] = useState(defaultCity || null);

  const defaultOwnerId = estate?.ownerDS?.id || null;
  const defaultOwner = ownerList.find((owner) => owner.id === defaultOwnerId);
  const [ddlSelectedOwner, setDdlSelectedOwner] = useState(
    defaultOwner || null
  );

  const {
    value: estateName,
    isValid: inputIsValidName,
    hasError: inputHasErrorName,
    valueChangeHandler: inputChangeHandlerName,
    inputBlurHandler: inputBlurHandlerName,
    reset: inputResetName,
  } = useInput(
    (value) => value.trim() !== "", // validateValue function
    null, // onChangeCallback
    estate ? estate.name : ""
  );

  const {
    value: estateAddress,
    isValid: inputIsValidAddress,
    hasError: inputHasErrorAddress,
    valueChangeHandler: inputChangeHandlerAddress,
    inputBlurHandler: inputBlurHandlerAddress,
    reset: inputResetAddress,
  } = useInput(
    (value) => value.trim() !== "", // validateValue function
    null, // onChangeCallback
    estate ? estate.address : ""
  );

  const {
    value: estateComments,
    isValid: inputIsValidComments,
    hasError: inputHasErrorComments,
    valueChangeHandler: inputChangeHandlerComments,
    inputBlurHandler: inputBlurHandlerComments,
    reset: inputResetComments,
  } = useInput(
    (value) => true,
    null, // onChangeCallback
    estate ? estate.comments : ""
  );

  const handleCancel = () => {
    navigate("/estates"); // Reemplaza con la ruta deseada
  };

  const handleDelete = async () => {
    if (estate && estate.id) {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que quieres eliminar esta propiedad?"
      );
      if (confirmDelete) {
        await removeData(urlEstate, estate.id);
        dispatch(fetchEstateList());
        navigate("/estates");
      }
    }
  };

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    // Verificar si se seleccionó una provincia
    const inputIsValidCity = ddlSelectedCity !== null;
    if (!inputIsValidCity) {
      setInputHasErrorCity(true);
      return;
    }

    const inputIsValidOwner = ddlSelectedOwner !== null;
    if (!inputIsValidOwner) {
      setInputHasErrorOwner(true);
      return;
    }

    setIsValidForm(
      inputIsValidName &&
        inputIsValidAddress &&
        inputIsValidComments &&
        inputIsValidCity &&
        inputIsValidOwner
    );

    if (!isValidForm) {
      return;
    }

    setAddressError(""); // Limpiar errores previos

    const latLonResult = await verifyAddress();
    if (latLonResult) {
      console.log("latLonResult después de verifyAddress:", latLonResult);

      if (latLonResult && latLonResult.lat) {
        const dataToUpload = {
          Name: estateName,
          Address: estateAddress,
          Comments: estateComments,
          CityDSId: ddlSelectedCity.id,
          OwnerDSId: ddlSelectedOwner.id,
          LatLong: `${latLonResult.lat},${latLonResult.lon}`,
          GoogleMapsURL: `https://www.google.com/maps/search/${latLonResult.lat},${latLonResult.lon}`,
        };
        console.log("dataToUpload:", dataToUpload);

        try {
          await uploadData(dataToUpload, urlEstate, editMode, estate?.id);
          dispatch(fetchEstateList());

          setTimeout(() => {
            navigate("/estates");
          }, 1000);
        } catch (error) {
          console.error("Error al enviar los datos:", error);
          if (error === "Dirección no encontrada.") {
            setAddressError(true);
          }
        }
      } else {
        console.error("Error al enviar los datos");
        setAddressError(true);
      }
    } else {
      // Manejo de error si no se obtienen las coordenadas
      console.error("No se pudo obtener las coordenadas");
    }
  };

  const handleSelectDdlCity = (item) => {
    setDdlSelectedCity(item);
  };

  const handleSelectDdlOwner = (item) => {
    setDdlSelectedOwner(item);
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

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
        //const query = `${estateAddress}, ${citycode}, ${countrycode}`;
        const query = `${estateAddress}`;
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

        // Filtrar por la ciudad seleccionada
        const matchingAddresses = data.filter(
          (item) => item.address.city === ddlSelectedCity.name
        );

        if (matchingAddresses.length === 0) {
          setAddressError(
            "Dirección no encontrada para la ciudad seleccionada."
          );
          return;
        }

        // Asumir que se toma el primer resultado coincidente
        const { lat, lon } = matchingAddresses[0];
        setLatLong({ lat, lon });
        resolve({ lat, lon });
        console.log("Coordenadas obtenidas:", lat, lon);
      } catch (error) {
        console.error("Error al verificar la dirección:", error);
        setAddressError("Error al verificar la dirección");
        // reject("Error al verificar la dirección");
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div>
                  <CCardTitle>
                    {editMode
                      ? "Modificar la propiedad"
                      : "Agregar una propiedad"}
                  </CCardTitle>
                </div>
                {editMode && estate && estate.id && (
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={handleDelete}
                    style={{ marginLeft: "auto" }}
                  >
                    Eliminar
                  </CButton>
                )}
              </div>
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
                {addressError && (
                  <CAlert color="danger" className="w-100">
                    {addressError.toString()}
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
                {inputHasErrorCity && (
                  <CAlert color="danger" className="w-100">
                    Entrada inválida
                  </CAlert>
                )}
              </CInputGroup>
              <br />
              <CInputGroup>
                <CInputGroupText className="cardItem custom-input-group-text">
                  Dueño
                </CInputGroupText>
                <CDropdown>
                  <CDropdownToggle id="ddOwner" color="secondary">
                    {ddlSelectedOwner ? ddlSelectedOwner.name : "Seleccionar"}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {ownerList &&
                      ownerList.length > 0 &&
                      ownerList.map((owner) => (
                        <CDropdownItem
                          key={owner.id}
                          onClick={() => handleSelectDdlOwner(owner)}
                          style={{ cursor: "pointer" }}
                          value={owner.id}
                        >
                          {owner.id}: {owner.name}
                        </CDropdownItem>
                      ))}
                  </CDropdownMenu>
                </CDropdown>
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
              <CButton
                type="button"
                color="secondary"
                onClick={handleCancel}
                style={{ marginLeft: "10px" }}
              >
                Cancelar
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
                    {errorAPI.toString()}
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

export default EstateABM;
