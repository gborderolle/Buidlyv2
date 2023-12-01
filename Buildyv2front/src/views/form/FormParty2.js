import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CForm, CCardFooter, CButton, CRow } from "@coreui/react";

import { LoadingSpinner } from "../../utils/LoadingSpinner";
import WidgetsBrandParty from "./widgets/WidgetsBrandParty";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchPartyList } from "../../store/generalData-actions";
import { uiActions } from "../../store/ui-slice";
import { formActions } from "../../store/form-slice";

const buttonColor = "dark";

const FormParty2 = (props) => {
  //#region Consts ***********************************

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisabledParty, setIsDisabledParty] = useState(false);
  const [isValidArrayParty, setIsValidArrayParty] = useState([true]);
  const [isValidFormParty, setIsValidFormParty] = useState(true);
  const [isSuccessParty, setIsSuccessParty] = useState(false);
  const [votosPartyTotal, setVotosPartyTotal] = useState(0);
  const [partyList, setPartyList] = useState([]);
  const [filteredPartyList, setFilteredPartyList] = useState([]);

  // redux gets
  const reduxPartyList = useSelector((state) => state.generalData.partyList);
  const reduxSelectedCircuit = useSelector(
    (state) => state.liveSettings.circuit
  );

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    let list = getFilteredParties();
    setFilteredPartyList(list);

    const totalVotosParty = list.reduce((total, party) => {
      return total + Number(party.partyVotes); // Asegúrate de que partyVote.votes no sea undefined
    }, 0);

    setVotosPartyTotal(totalVotosParty);
    props.setVotosPartyTotal(totalVotosParty);

    // SET REDUX ACA
    dispatch(formActions.setVotosPartyTotalRedux(totalVotosParty));
  }, [reduxSelectedCircuit, props.setVotosPartyTotal]);

  // Actualizo la cantidad de votos total para todas las listas (footer label)
  useEffect(() => {
    const updatedTotalVotes = filteredPartyList.reduce(
      (total, party) => total + Number(party.partyVotes),
      0
    );

    setVotosPartyTotal(updatedTotalVotes);
    props.setVotosPartyTotal(updatedTotalVotes);

    // SET REDUX ACA
    dispatch(formActions.setVotosPartyTotalRedux(updatedTotalVotes));
  }, [filteredPartyList]);

  useEffect(() => {
    const initialArray = Array(partyList.length).fill(true);
    setIsValidArrayParty(initialArray);
  }, [partyList]);

  useEffect(() => {
    if (isSuccessParty) {
      dispatch(
        uiActions.setStepsSubmitted({ step: "step2", isSubmitted: true })
      );

      setTimeout(() => {
        navigate("/FormExtras1");
      }, 100);
    }
  }, [isSuccessParty, dispatch]);

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandlerParty = async (event) => {
    await props.formHandlerGeneric(
      event,
      isValidArrayParty,
      setIsValidFormParty,
      setIsDisabledParty,
      filteredPartyList,
      "partyList",
      setIsSuccessParty,
      props.setIsLoading,
      reduxSelectedCircuit
    );

    // SET REDUX ACA
    dispatch(formActions.setVotosPartyTotalRedux(votosPartyTotal));

    // update lista
    setFilteredPartyList(getFilteredParties(partyList));

    // Redux fetch DB
    dispatch(fetchPartyList()); // refresh DB data
  };

  const validityHandlerParty = (index, isValid) => {
    setIsValidArrayParty((prevIsValidArray) => {
      const updatedIsValidArray = [...prevIsValidArray];
      updatedIsValidArray[index] = isValid;
      return updatedIsValidArray;
    });
  };

  // Actualiza los votos para un partido específico
  const updateVotesHandlerParty = (partyId, newVotes) => {
    // Actualiza los votos para un partido específico
    const updatedPartyList = filteredPartyList.map((party) =>
      party.partyId === partyId ? { ...party, partyVotes: newVotes } : party
    );
    setFilteredPartyList(updatedPartyList);
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

  const getFilteredParties = () => {
    if (
      !reduxPartyList ||
      !reduxSelectedCircuit ||
      !reduxSelectedCircuit.partyVotesList
    )
      return [];

    return reduxSelectedCircuit.partyVotesList
      .filter((partyVote) => partyVote.partyId !== 0) // Filtrar partidos con partyId diferente de 0
      .map((partyVote) => {
        const partyDetail = reduxPartyList.find(
          (party) => party.partyId === partyVote.partyId
        );

        // Si no encuentra detalles del partido, retorna undefined.
        // Esto se maneja para evitar incluir partidos no encontrados.
        if (!partyDetail) return;

        return {
          ...partyDetail,
          partyVotes: partyVote.votes, // o el campo correspondiente de partyVotesList
        };
      })
      .filter((party) => party !== undefined); // Eliminar elementos undefined resultantes de partidos no encontrados
  };

  const partyList1 = filteredPartyList.map((party, index) => (
    <WidgetsBrandParty
      key={party.pushId}
      id={String(party.partyId)}
      title={party.partyName}
      defaultValue={party.partyVotes}
      onValidityChange={(isValid) => validityHandlerParty(index, isValid)}
      onUpdateVotes={(newVotes) =>
        updateVotesHandlerParty(party.partyId, +newVotes)
      }
      disabled={props.isLoading}
      otherVotes={Number(props.TOTALVotosGLOBAL)}
      name={party.partyName}
      imageURL={party.partyImageURL} // Asegúrate de que esta URL exista en el objeto partyVote
      maxValue={500}
      currentGlobalVotes={votosPartyTotal}
    />
  ));

  //#endregion Functions ***********************************

  //#region JSX props ***********************************

  const labelSelectCircuit = (
    <span style={{ color: "blue", fontStyle: "italic", width: "auto" }}>
      Seleccione un circuito.
    </span>
  );

  //#endregion JSX props ***********************************

  return (
    <>
      <CForm
        onSubmit={formSubmitHandlerParty}
        style={{ paddingBottom: "4rem" }}
      >
        <CRow className="justify-content-center">
          {props.isLoading ? (
            <LoadingSpinner />
          ) : reduxSelectedCircuit && reduxSelectedCircuit.circuitId > 0 ? (
            partyList1
          ) : (
            <>
              {labelSelectCircuit}
              <br />
              <br />
            </>
          )}
        </CRow>
        <CCardFooter
          className="text-medium-emphasis"
          style={{ textAlign: "center" }}
        >
          <div style={{ textAlign: "center" }}>
            <CButton type="submit" color={buttonColor}>
              Siguiente
            </CButton>
          </div>
        </CCardFooter>
      </CForm>
    </>
  );
};
export default FormParty2;
