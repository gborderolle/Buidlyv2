import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CCol, CRow } from "@coreui/react";
import GroupInputParty from "./group/GroupInputParty";
import GroupInputMyParty from "./group/GroupInputMyParty";
import GroupInputProvince from "./group/GroupInputProvince";
import GroupInputMunicipality from "./group/GroupInputMunicipality";
import GroupInputCircuit from "./group/GroupInputCircuit";
import GroupInputSlate from "./group/GroupInputSlate";
import GroupInputCandidate from "./group/GroupInputCandidate";

import { FirebaseUrls, getAutoIncrementedId } from "../../utils/firebaseSetup";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";

const DataMenu = () => {
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

  const partyData = async (partyName, uploadedImageURL, partyColor) => {
    const id = await getAutoIncrementedId(FirebaseUrls.partyFinal);
    return {
      partyId: id,
      partyName,
      partyDescription: "",
      partyVotes: 0,
      partyImageURL: uploadedImageURL,
      partyColor,
    };
  };

  const myPartyData = async (
    partyName,
    partyNameLong,
    userName,
    provinceId,
    uploadedImageURL,
    partyColor
  ) => {
    return {
      partyId: 0,
      partyName,
      partyNameLong,
      userName,
      provinceId,
      myPartyImageURL: uploadedImageURL,
      partyColor,
    };
  };

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

  const municipalityData = async (municipalityName, provinceId) => {
    const id = await getAutoIncrementedId(FirebaseUrls.municipalityFinal);
    return {
      municipalityId: id,
      municipalityName,
      provinceId,
    };
  };

  const circuitData = async (
    circuitName,
    circuitNumber,
    provinceId,
    municipalityId,
    circuitLatLong
  ) => {
    const id = await getAutoIncrementedId(FirebaseUrls.circuitFinal);
    return {
      circuitId: id,
      circuitName,
      circuitNumber,
      circuitDescription: "",
      circuitPopulation: 500,
      circuitLatLong,
      circuitNullVotes: 0,
      circuitBlankVotes: 0,
      circuitRecurredVotes: 0,
      circuitObservedVotes: 4, // 4 por defecto
      circuitComments: "",

      provinceId,
      municipalityId,
      step1completed: false,
      step2completed: false,
      step3completed: false,
    };
  };

  const candidateData = async (candidateName, uploadedImageURL) => {
    const id = await getAutoIncrementedId(FirebaseUrls.candidateFinal);
    return {
      candidateId: id,
      candidateName,
      candidateImageURL: uploadedImageURL,
    };
  };

  const slateData = async (slateName, slateColor, provinceId, candidateId) => {
    const id = await getAutoIncrementedId(FirebaseUrls.slateFinal);
    return {
      slateId: id,
      slateName,
      slateDescription: "",
      slateVotes: 0,
      slateColor,
      candidateId,
      provinceId,
      circuitId: 0, // ToDo: Arreglar, quitar?
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
        <GroupInputMyParty
          title="2. Mis datos y mi partido"
          labelName="Nombre corto (partido)"
          labelNameLong="Nombre largo (partido)"
          labelUser="Usuario"
          labelProvince="Depto. del usuario"
          firebaseUrlClean={FirebaseUrls.myPartyClean}
          firebaseUrlFinal={FirebaseUrls.myPartyFinal}
          createDataToUpload={myPartyData}
        />
        <br />
        <GroupInputParty
          title="3. Partidos políticos"
          labelName="Nombre corto"
          labelNameLong="Nombre largo"
          firebaseUrlClean={FirebaseUrls.partyClean}
          firebaseUrlFinal={FirebaseUrls.partyFinal}
          createDataToUpload={partyData}
        />
        <br />
        <GroupInputCandidate
          title="4. Candidatos de mi partido"
          inputLabel="Nombre completo"
          firebaseUrlClean={FirebaseUrls.candidateClean}
          firebaseUrlFinal={FirebaseUrls.candidateFinal}
          createDataToUpload={candidateData}
        />
        <br />
        <GroupInputSlate
          title="5. Listas de mi partido"
          inputLabel="Nombre"
          firebaseUrlClean={FirebaseUrls.slateClean}
          firebaseUrlFinal={FirebaseUrls.slateFinal}
          createDataToUpload={slateData}
          labelFkProvince="Deptartamento"
          labelFkCandidate="Candidato"
        />
        <br />
        <GroupInputMunicipality
          title="Municipios (excel)"
          labelName="Nombre"
          firebaseUrlClean={FirebaseUrls.municipalityClean}
          firebaseUrlFinal={FirebaseUrls.municipalityFinal}
          createDataToUpload={municipalityData}
          labelFk="Deptartamento"
          formBackground="warningBackground"
        />
        <br />
        <GroupInputCircuit
          title="Circuitos (excel)"
          inputLabel="Nombre"
          inputNumberLabel="Número"
          firebaseUrlClean={FirebaseUrls.circuitClean}
          firebaseUrlFinal={FirebaseUrls.circuitFinal}
          firebaseUrlFK={FirebaseUrls.partyClean}
          createDataToUpload={circuitData}
          labelFk1="Depto."
          labelFk2="Municipio"
          labelLatLong="Ubicación (lat, long)"
          formBackground="warningBackground"
        />
        <br />
        <br />
      </CCol>
    </CRow>
  );
};

export default DataMenu;
