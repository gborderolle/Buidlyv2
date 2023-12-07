import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import {
  CForm,
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCardFooter,
  CButton,
} from "@coreui/react";

import useBumpEffect from "../../../utils/useBumpEffect";
import "./FormStart.css";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { formActions } from "../../../store/form-slice";
import { liveSettingsActions } from "../../../store/liveSettings-slice";

const buttonColor = "dark";

const initialFixedCards = [
  {
    cardId: "circuitNullVotes",
    cardName: "Anulados",
    cardVotes: 0,
  },
  {
    cardId: "circuitBlankVotes",
    cardName: "En blanco",
    cardVotes: 0,
  },
  {
    cardId: "circuitRecurredVotes",
    cardName: "Recurridos",
    cardVotes: 0,
  },
  {
    cardId: "circuitObservedVotes",
    cardName: "Observados",
    cardVotes: 0,
  },
];

const FormSummary = () => {
  //#region Consts ***********************************

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [partyList, setPartyList] = useState([]);
  const [slateList, setSlateList] = useState([]);
  const [filteredSlateList, setFilteredSlateList] = useState([]);
  const [fixedCards, setFixedCards] = useState(initialFixedCards);

  // redux gets
  const reduxPartyList = useSelector((state) => state.generalData.partyList);
  const reduxSlateList = useSelector(
    (state) => state.generalData.slateList || []
  );
  const reduxSelectedCircuit = useSelector(
    (state) => state.liveSettings.circuit
  );
  const circuitImagesUploadedCount = reduxSelectedCircuit
    ? reduxSelectedCircuit.circuitImagesUploadedCount
    : 0;

  const [isBumped, triggerBump] = useBumpEffect();
  const [animateTable, setAnimateTable] = useState(false);

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  // Scroll to top of the page on startup
  useEffect(() => {
    window.scrollTo(0, 0);
    setAnimateTable(true);
  }, []);

  useEffect(() => {
    dispatch(uiActions.showStepSummary());

    return () => {
      dispatch(uiActions.hideStepSummary());
    };
  }, [dispatch]);

  useEffect(() => {
    // redux set ON
    dispatch(uiActions.showCircuitName());

    return () => {
      // redux set OFF
      dispatch(uiActions.hideCircuitName());
    };
  }, [dispatch]);

  useEffect(() => {
    // Actualizar partyList y slateList con la información de Redux
    setPartyList(reduxPartyList);
    setSlateList(reduxSlateList);
  }, [reduxPartyList, reduxSlateList]);

  useEffect(() => {
    if (reduxSelectedCircuit) {
      const filteredSlates = getFilteredSlates(slateList, reduxSelectedCircuit);
      setFilteredSlateList(filteredSlates);
    }
  }, [partyList, slateList, reduxSelectedCircuit]);

  useEffect(() => {
    // Asegúrate de que newVotes no sea nulo o undefined y tenga la forma esperada
    if (reduxSelectedCircuit && Object.keys(reduxSelectedCircuit).length > 0) {
      setFixedCards((prevCards) => {
        return prevCards.map((card) => {
          // Si newVotes tiene una entrada para el cardId actual, actualízalo
          const newVoteCount = reduxSelectedCircuit[card.cardId];
          return {
            ...card,
            cardVotes:
              newVoteCount !== undefined ? newVoteCount : card.cardVotes,
          };
        });
      });
    }
  }, [reduxSelectedCircuit]); // La dependencia es newVotes, así que este efecto se ejecutará cada vez que newVotes cambie

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const getFilteredSlates = (listSlates, selectedCircuit) => {
    if (!listSlates || !selectedCircuit || !selectedCircuit.slateVotesList)
      return [];

    return selectedCircuit.slateVotesList.map((slateVote) => {
      const slateDetail = listSlates.find(
        (slate) => slate.slateId === slateVote.slateId
      );
      return {
        ...slateDetail,
        slateVotes: slateVote.votes, // o el campo correspondiente de partyVotesList
      };
    });
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

  //#region JSX props ***********************************

  // ---------- Totales de votos

  const totalSlateVotes = filteredSlateList.reduce(
    (acc, slate) => acc + Number(slate.slateVotes),
    0
  );

  const totalPartyVotes = reduxSelectedCircuit?.partyVotesList?.reduce(
    (acc, party) => acc + Number(party.votes),
    0
  );

  const votosExtrasTotal = fixedCards.reduce(
    (acc, card) => acc + card.cardVotes,
    0
  );

  // ---------- Ordenamiento de listas

  // Ordena filteredPartyList por votos de mayor a menor
  const sortedPartyList = [
    ...(reduxSelectedCircuit?.partyVotesList || []),
  ].sort((a, b) => b.votes - a.votes);

  const sortedSlateList = [...(filteredSlateList || [])].sort(
    (a, b) => b.slateVotes - a.slateVotes
  );

  const sortedCardList = [...fixedCards].sort(
    (a, b) => b.cardVotes - a.cardVotes
  );

  //#endregion JSX props ***********************************

  return (
    <>
      <CForm onSubmit={bumpHandler} style={{ paddingBottom: "5rem" }}>
        <CCard className="mb-4">
          <CCardHeader>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>Paso 4. Resumen final</div>
              <button
                onClick={bumpHandler}
                style={{ border: "none", background: "none", float: "right" }}
                className={isBumped ? "bump" : ""}
              >
                <FontAwesomeIcon icon={faHome} color="#697588" />
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={12} md={12} lg={12} xl={12}>
                <CTable className={animateTable ? "animated-table" : ""}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Lista</CTableHeaderCell>
                      <CTableHeaderCell>Votación</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sortedSlateList &&
                      sortedSlateList.map((slate, index) => (
                        <CTableRow key={slate.id || index}>
                          <CTableHeaderCell scope="row">
                            {index + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>{slate.slateName}</CTableDataCell>
                          <CTableDataCell>{slate.slateVotes}</CTableDataCell>
                        </CTableRow>
                      ))}
                    <CTableRow>
                      <CTableDataCell
                        colSpan="2"
                        style={{ fontWeight: "bold" }}
                      >
                        Total
                      </CTableDataCell>
                      <CTableDataCell style={{ fontWeight: "bold" }}>
                        {totalSlateVotes}
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <br />
                <CTable className={animateTable ? "animated-table" : ""}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Partido</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Votación</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sortedPartyList &&
                      sortedPartyList.map((party, index) => (
                        <CTableRow key={party.partyId || index}>
                          <CTableHeaderCell scope="row">
                            {index + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>
                            {party.partyNameLong
                              ? party.partyNameLong
                              : party.partyName}
                          </CTableDataCell>
                          <CTableDataCell>{party.votes}</CTableDataCell>
                        </CTableRow>
                      ))}
                    <CTableRow>
                      <CTableDataCell
                        colSpan="2"
                        style={{ fontWeight: "bold" }}
                      >
                        Total
                      </CTableDataCell>
                      <CTableDataCell style={{ fontWeight: "bold" }}>
                        {totalPartyVotes}
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <br />
                <CTable className={animateTable ? "animated-table" : ""}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Extras</CTableHeaderCell>
                      <CTableHeaderCell>Votación</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sortedCardList &&
                      sortedCardList.map((card, index) => (
                        <CTableRow key={card.cardId || index}>
                          <CTableHeaderCell scope="row">
                            {index + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>{card.cardName}</CTableDataCell>
                          <CTableDataCell>{card.cardVotes}</CTableDataCell>
                        </CTableRow>
                      ))}
                    <CTableRow>
                      <CTableDataCell
                        colSpan="2"
                        style={{ fontWeight: "bold" }}
                      >
                        Total
                      </CTableDataCell>
                      <CTableDataCell style={{ fontWeight: "bold" }}>
                        {votosExtrasTotal}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell colSpan="2">
                        Actas cargadas
                      </CTableDataCell>
                      <CTableDataCell>
                        {circuitImagesUploadedCount}
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
            <CCardFooter
              className="text-medium-emphasis"
              style={{ textAlign: "center" }}
            >
              <div style={{ textAlign: "center" }}>
                <CButton type="submit" color={buttonColor}>
                  Finalizar
                </CButton>
              </div>
            </CCardFooter>
          </CCardBody>
        </CCard>
      </CForm>
    </>
  );
};

export default FormSummary;
