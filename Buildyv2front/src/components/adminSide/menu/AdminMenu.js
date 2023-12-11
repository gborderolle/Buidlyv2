import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CCol, CRow } from "@coreui/react";
import GroupInputDelegado from "./group/GroupInputDelegado";
import GroupInputUser from "./group/GroupInputUser";
import GroupInputRole from "./group/GroupInputRole";

import {
  FirebaseUrls,
  getAutoIncrementedId,
} from "../../../utils/firebaseSetup";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/auth-slice";

const AdminMenu = () => {
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
      navigate("/login");
    }
  }, [userRoleNumber, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  //#endregion Const ***********************************

  //#region Functions ***********************************

  const roleData = async (roleName, roleNumber) => {
    const id = await getAutoIncrementedId(FirebaseUrls.roleFinal);
    return {
      roleId: id,
      roleName,
      roleNumber,
    };
  };

  const delegadoData = async (
    delegadoName,
    delegadoCI,
    delegadoPhone,
    provinceId,
    municipalityId
  ) => {
    const id = await getAutoIncrementedId(FirebaseUrls.delegadoFinal);
    return {
      delegadoId: id,
      delegadoName,
      delegadoCI,
      delegadoPhone,
      delegadoProvinceId: provinceId,
      municipalityId,
      delegadoRoleNumber: 2,
    };
  };

  const userData = async (
    userFullname,
    username,
    userPassword,
    userProvinceId,
    userRoleNumber
  ) => {
    const id = await getAutoIncrementedId(FirebaseUrls.userFinal);
    return {
      userId: id,
      userFullname,
      username,
      userPassword,
      userProvinceId,
      userRoleNumber,
      userMunicipalityId: 1,
    };
  };

  //#endregion Functions ***********************************

  return (
    <CRow>
      <CCol xs>
        <GroupInputRole
          title="Roles"
          inputName="Nombre"
          inputNumber="Número"
          firebaseUrlClean={FirebaseUrls.roleClean}
          firebaseUrlFinal={FirebaseUrls.roleFinal}
          createDataToUpload={roleData}
        />
        <br />
        <GroupInputDelegado
          title="Delegados"
          inputFullname="Nombre completo"
          inputCI="CI (sin guión)"
          inputRole="Rol"
          inputMunicipality="Municipio"
          inputPhone="Teléfono"
          firebaseUrlClean={FirebaseUrls.delegadoClean}
          firebaseUrlFinal={FirebaseUrls.delegadoFinal}
          createDataToUpload={delegadoData}
        />
        <br />
        <GroupInputUser
          title="Usuarios"
          inputUsername="Nombre de usuario"
          inputFullname="Nombre completo"
          inputPassword="Password"
          inputRole="Rol"
          firebaseUrlClean={FirebaseUrls.userClean}
          firebaseUrlFinal={FirebaseUrls.userFinal}
          createDataToUpload={userData}
          labelFk="Departamento"
        />
        <br />
        <br />
      </CCol>
    </CRow>
  );
};

export default AdminMenu;
