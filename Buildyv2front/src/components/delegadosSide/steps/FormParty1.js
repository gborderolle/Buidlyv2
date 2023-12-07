import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../utils/firebaseSetup";
import { ref, update } from "firebase/database";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { CCard, CCardBody, CCol, CCardHeader, CRow } from "@coreui/react";

import FormParty2 from "./FormParty2";
import useBumpEffect from "../../../utils/useBumpEffect";
import "./FormStart.css";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { formActions } from "../../../store/form-slice";
import { liveSettingsActions } from "../../../store/liveSettings-slice";

const FormParty1 = () => {
  //#region Consts ***********************************

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux gets
  const [isLoadingParty, setIsLoadingParty] = useState(false);
  const TOTALVotosGLOBAL = useSelector((state) => state.form.TOTALVotosGLOBAL);
  const [votosPartyTotal, setVotosPartyTotal] = useState(0);
  const [isBumped, triggerBump] = useBumpEffect();

  const delegadoId = useSelector((state) => state.auth.userId);

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  // Scroll to top of the page on startup
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(formActions.setTOTALVotosGLOBAL(votosPartyTotal));
  }, [votosPartyTotal, dispatch]);

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
    setLoading,
    reduxSelectedCircuit
  ) => {
    event.preventDefault();
    const allValid = isValidArray.every(Boolean);

    if (!allValid) {
      setIsValidForm(false);
      return;
    }

    setIsValidForm(true);
    setIsDisabled(true);

    // Actualizar PartyVotesList en reduxSelectedCircuit con los nuevos votos
    const updatedPartyVotesList = reduxSelectedCircuit.partyVotesList.map(
      (partyVote) => {
        const updatedVote = list.find(
          (party) => party.partyId == partyVote.partyId
        )?.partyVotes;
        return updatedVote !== undefined
          ? { ...partyVote, votes: updatedVote }
          : partyVote;
      }
    );

    // Actualizar el circuito seleccionado en Firebase
    const circuitRef = ref(
      database,
      `circuitList/${reduxSelectedCircuit.pushId}`
    );
    const updates = { partyVotesList: updatedPartyVotesList };

    setLoading(true);

    let isSuccess = false;
    try {
      await update(circuitRef, updates);
      setIsSuccess(true);
      isSuccess = true;
    } catch (error) {
      console.error("Error al actualizar el circuito:", error);
      setIsSuccess(false);
    }

    setLoading(false);

    // Si el envío fue exitoso, intenta actualizar el circuito
    if (isSuccess) {
      dispatch(liveSettingsActions.setPartyVotesList(updatedPartyVotesList));
      updateCircuitStep(reduxSelectedCircuit);
    }
  };

  const updateCircuitStep = (reduxSelectedCircuit) => {
    // Verifica si se seleccionó un circuito
    if (reduxSelectedCircuit && reduxSelectedCircuit.circuitId) {
      // Define la referencia al circuito específico
      const circuitRef = ref(
        database,
        `circuitList/${reduxSelectedCircuit.pushId}`
      );

      // Actualiza el campo step2completed a true
      update(circuitRef, {
        step2completed: true,
        lastUpdateDelegadoId: delegadoId,
      })
        .then(() => {})
        .catch((error) => {
          console.error("Error al actualizar el circuito:", error);
        });

      // Actualizar step en Redux
      dispatch(liveSettingsActions.setStepCompletedCircuit(2));
    }
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>Paso 2. Todos los partidos</div>
            <button
              onClick={bumpHandler}
              style={{ border: "none", background: "none", float: "right" }}
              className={isBumped ? "bump" : ""}
            >
              <FontAwesomeIcon icon={faHome} color="#697588" />{" "}
            </button>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormParty2
                formHandlerGeneric={formHandlerGeneric}
                isLoading={isLoadingParty}
                setIsLoading={setIsLoadingParty}
                TOTALVotosParty={votosPartyTotal}
                setVotosPartyTotal={setVotosPartyTotal}
                TOTALVotosGLOBAL={TOTALVotosGLOBAL}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  );
};

export default FormParty1;
