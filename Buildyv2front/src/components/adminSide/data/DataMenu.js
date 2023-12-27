import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CCol, CRow } from "@coreui/react";
import GroupInputCity from "./GroupInputCity";
import GroupInputProvince from "./GroupInputProvince";
import GroupInputCountry from "./GroupInputCountry";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/auth-slice";

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
        <GroupInputCity
          title="Agregar ciudad"
          inputName="Nombre"
          nominatimCode="Código Nominatim"
          createDataToUpload={cityData}
        />
        <br />
        <GroupInputProvince
          title="Agregar departamento"
          inputName="Nombre"
          nominatimCode="Código Nominatim"
          createDataToUpload={provinceData}
        />
        <br />
        <GroupInputCountry
          title="Agregar país"
          inputName="Nombre"
          nominatimCode="Código Nominatim [UY]"
          createDataToUpload={countryData}
        />
        <br />
        <br />
      </CCol>
    </CRow>
  );
};

export default DataMenu;
