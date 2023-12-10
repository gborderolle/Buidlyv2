import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CCol, CRow } from "@coreui/react";
import GroupInputProvince from "../menu/group/GroupInputProvince";

import {
  FirebaseUrls,
  getAutoIncrementedId,
} from "../../../utils/firebaseSetup";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/auth-slice";

const AddEstate = () => {
  //#region Const ***********************************

  // redux
  const dispatch = useDispatch();

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const userRoleNumber = useSelector((state) => state.auth.userRoleNumber);
  useEffect(() => {
    const USER_ROLE_ID = 1;
    if (userRoleNumber != USER_ROLE_ID) {
      dispatch(authActions.logout());
      navigate("/login-general");
    }
  }, [userRoleNumber, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  //#endregion Const ***********************************

  //#region Functions ***********************************

  const provinceData = async (provinceName, provinceCenter) => {
    const id = await getAutoIncrementedId(FirebaseUrls.provinceFinal);
    return {
      provinceId: id,
      provinceName,
      provinceDescription: "",
      provinceCenter,
      provinceZoom: 13,
    };
  };

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <GroupInputProvince
          title="1. Departamentos"
          labelName="Nombre"
          labelCenter="Centro (Lat, Long)"
          firebaseUrlClean={FirebaseUrls.provinceClean}
          firebaseUrlFinal={FirebaseUrls.provinceFinal}
          createDataToUpload={provinceData}
        />
        <br />
        <br />
      </CCol>
    </CRow>
  );
};

export default AddEstate;
