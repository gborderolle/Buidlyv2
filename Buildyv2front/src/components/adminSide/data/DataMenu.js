import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  CCol,
  CRow,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CCard,
  CCardHeader,
  CCardBody,
} from "@coreui/react";
import GroupInputCity from "./GroupInputCity";
import GroupInputProvince from "./GroupInputProvince";
import GroupInputCountry from "./GroupInputCountry";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import CityTable from "./CityTable";
import ProvinceTable from "./ProvinceTable";
import CountryTable from "./CountryTable";

const DataMenu = () => {
  //#region Const ***********************************

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

  //#endregion Const ***********************************

  //#region Functions ***********************************

  const cityData = async (cityName, provinceId) => {
    return {
      cityName,
      provinceId,
    };
  };

  const provinceData = async (provinceName, countryId) => {
    return {
      provinceName,
      countryId,
    };
  };

  const countryData = async (countryName) => {
    return {
      countryName,
    };
  };

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <CAccordion>
          <CAccordionItem itemKey={1}>
            <CAccordionHeader className="custom-accordion-header">
              Menú ciudades
            </CAccordionHeader>
            <CAccordionBody>
              <CCard>
                <CCardHeader>Tabla de datos</CCardHeader>
                <CCardBody>
                  <CityTable
                    title="Menú ciudades"
                    inputName="Nombre"
                    nominatimCode="Código nominatim"
                    createDataToUpload={cityData}
                  />
                </CCardBody>
              </CCard>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
        <br />
        <CAccordion>
          <CAccordionItem itemKey={1}>
            <CAccordionHeader className="custom-accordion-header">
              Menú departamentos
            </CAccordionHeader>
            <CAccordionBody>
              <CCard>
                <CCardHeader>Tabla de datos</CCardHeader>
                <CCardBody>
                  <ProvinceTable
                    title="Menú departamentos"
                    inputName="Nombre"
                    nominatimCode="Código nominatim"
                    createDataToUpload={provinceData}
                  />
                </CCardBody>
              </CCard>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
        <br />
        <CAccordion>
          <CAccordionItem itemKey={1}>
            <CAccordionHeader className="custom-accordion-header">
              Menú países
            </CAccordionHeader>
            <CAccordionBody>
              <CCard>
                <CCardHeader>Tabla de datos</CCardHeader>
                <CCardBody>
                  <CountryTable
                    title="Menú países"
                    inputName="Nombre"
                    nominatimCode="Código nominatim"
                    createDataToUpload={countryData}
                  />
                </CCardBody>
              </CCard>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
        <br />
        <br />
      </CCol>
    </CRow>
  );
};

export default DataMenu;
