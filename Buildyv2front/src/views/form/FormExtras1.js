import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../utils/firebaseSetup";
import { ref, update } from "firebase/database";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from "@coreui/react";

import FormExtras2 from "./FormExtras2";
import useBumpEffect from "../../utils/useBumpEffect";
import "./FormStart.css";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { formActions } from "../../store/form-slice";
import { uiActions } from "../../store/ui-slice";
import { liveSettingsActions } from "../../store/liveSettings-slice";

const FormExtras1 = () => {
  //#region Consts ***********************************

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux gets
  const [isLoadingExtras, setIsLoadingExtras] = useState(false);
  const TOTALVotosGLOBAL = useSelector((state) => state.form.TOTALVotosGLOBAL);
  const [TOTALVotosExtras, setTOTALVotosExtras] = useState(0);
  const [isBumped, triggerBump] = useBumpEffect();

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  // Scroll to top of the page on startup
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(formActions.setTOTALVotosGLOBAL(TOTALVotosExtras));
  }, [TOTALVotosExtras, dispatch]);

  useEffect(() => {
    // redux set ON
    dispatch(uiActions.showCircuitName());

    return () => {
      // redux set OFF
      dispatch(uiActions.hideCircuitName());
    };
  }, [dispatch]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const updateFirebaseGeneric = async (list, collectionName, setLoading) => {
    setLoading(true);
    try {
      const updates = {};
      list.forEach((item) => {
        if (item.pushId) {
          updates[`/${collectionName}/${item.pushId}`] = item;
        }
      });
      await update(ref(database), updates);
      setLoading(false);
      return true;
    } catch (error) {
      console.error(`Error al enviar datos a ${collectionName}:`, error);
      setLoading(false);
      return false;
    }
  };

  const formHandlerGeneric = async (
    event,
    isValidArray,
    setIsValidForm,
    setIsDisabled,
    list,
    collectionName,
    setIsSuccess,
    setLoading
  ) => {
    event.preventDefault();
    const allValid = isValidArray.every(Boolean);

    if (!allValid) {
      setIsValidForm(false);
      return;
    }

    setIsValidForm(true);
    setIsDisabled(true);

    const isSuccess = await updateFirebaseGeneric(
      list,
      collectionName,
      setLoading
    );
    setIsSuccess(isSuccess);
    setLoading(false);
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const bumpHandler = () => {
    triggerBump();
    dispatch(liveSettingsActions.setSelectedCircuit(null));
    dispatch(formActions.emptyAllVotos());

    setTimeout(() => {
      navigate("/formStart");
    }, 200); // Asegúrate de que este tiempo coincida o sea ligeramente mayor que la duración de tu animación
  };

  //#endregion Events ***********************************

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          Paso 3. Datos extras del circuito
          <button
            onClick={bumpHandler}
            style={{ border: "none", background: "none", float: "right" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faHome} color="#697588" />{" "}
          </button>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormExtras2
                formHandlerGeneric={formHandlerGeneric}
                isLoading={isLoadingExtras}
                setIsLoading={setIsLoadingExtras}
                TOTALVotosExtras={TOTALVotosExtras}
                setTOTALVotosExtras={setTOTALVotosExtras}
                TOTALVotosGLOBAL={TOTALVotosGLOBAL}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  );
};

export default FormExtras1;
