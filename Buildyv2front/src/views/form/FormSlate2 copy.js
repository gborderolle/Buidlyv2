import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CForm, CCardFooter, CButton, CRow } from "@coreui/react";

import { LoadingSpinner } from "../../utils/LoadingSpinner";
import WidgetsBrandSlate2 from "./widgets/WidgetsBrandSlate2";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchSlateList } from "../../store/generalData-actions";
import { fetchVotosTotal } from "../../store/generalData-actions";
import { uiActions } from "../../store/ui-slice";
import { formActions } from "../../store/form-slice";

const buttonColor = "dark";

const FormSlate2 = (props) => {
  //#region Consts ***********************************

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisabledSlate, setIsDisabledSlate] = useState(false);
  const [isValidArraySlate, setIsValidArraySlate] = useState([true]);
  const [isValidFormSlate, setIsValidFormSlate] = useState(true);
  const [isSuccessSlate, setIsSuccessSlate] = useState(false);
  const [votosSlateTotal, setVotosSlateTotal] = useState(0);
  const [filteredSlateList, setFilteredSlateList] = useState([]);

  // redux gets
  const reduxSlateList = useSelector(
    (state) => state.generalData.slateList || []
  );
  const reduxSelectedCircuit = useSelector(
    (state) => state.liveSettings.circuit
  );

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    const fetchData = async () => {
      if (reduxSelectedCircuit) {
        await dispatch(fetchVotosTotal(reduxSelectedCircuit));
      }
    };

    fetchData();

    let list = getFilteredSlates();
    setFilteredSlateList(list);

    const totalVotosSlate = list.reduce(
      (total, slate) => total + Number(slate.slateVotes),
      0
    );

    setVotosSlateTotal(totalVotosSlate);
    props.setVotosSlateTotal(totalVotosSlate);

    // SET REDUX ACA
    dispatch(formActions.setVotosSlateTotalRedux(totalVotosSlate));
  }, [reduxSelectedCircuit, props.setVotosSlateTotal]);

  // Actualizo la cantidad de votos total para todas las listas (footer label)
  useEffect(() => {
    const totalVotosSlate = filteredSlateList.reduce(
      (total, slate) => total + Number(slate.slateVotes),
      0
    );

    setVotosSlateTotal(totalVotosSlate);
    props.setVotosSlateTotal(totalVotosSlate);

    // SET REDUX ACA
    dispatch(formActions.setVotosSlateTotalRedux(totalVotosSlate));
  }, [filteredSlateList]);

  useEffect(() => {
    if (isSuccessSlate) {
      dispatch(
        uiActions.setStepsSubmitted({ step: "step1", isSubmitted: true })
      );

      setTimeout(() => {
        navigate("/FormParty1");
      }, 100);
    }
  }, [isSuccessSlate, dispatch]);

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const formSubmitHandlerSlate = async (event) => {
    await props.formHandlerGeneric(
      event,
      isValidArraySlate,
      setIsValidFormSlate,
      setIsDisabledSlate,
      filteredSlateList,
      "slateList",
      setIsSuccessSlate,
      props.setIsLoading,
      reduxSelectedCircuit
    );
    props.setIsLoading(false);

    // SET REDUX ACA
    dispatch(formActions.setVotosSlateTotalRedux(votosSlateTotal));

    // Redux fetch DB
    dispatch(fetchSlateList()); // refresh DB data
  };

  const validityHandlerSlate = (index, isValid) => {
    setIsValidArraySlate((prevIsValidArray) => {
      const updatedIsValidArray = [...prevIsValidArray];
      updatedIsValidArray[index] = isValid;
      return updatedIsValidArray;
    });
  };

  const updateVotesHandlerSlate = (slateId, newVotes) => {
    setFilteredSlateList((prevSlates) =>
      prevSlates.map((slate) =>
        slate.slateId === slateId ? { ...slate, slateVotes: newVotes } : slate
      )
    );
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

  const getFilteredSlates = () => {
    if (
      !reduxSlateList ||
      !reduxSelectedCircuit ||
      !reduxSelectedCircuit.slateVotesList
    )
      return [];

    return reduxSelectedCircuit.slateVotesList.map((slateVote) => {
      const slateDetail = reduxSlateList.find(
        (slate) => slate.slateId === slateVote.slateId
      );
      return {
        ...slateDetail,
        slateVotes: slateVote.votes, // o el campo correspondiente de partyVotesList
      };
    });
  };

  const slateList1 = filteredSlateList.map((slate, index) => (
    <WidgetsBrandSlate2
      key={slate.slateId}
      id={String(slate.slateId)}
      title={slate.slateName}
      defaultValue={slate.slateVotes}
      onValidityChange={(isValid) => validityHandlerSlate(index, isValid)}
      onUpdateVotes={(newVotes) =>
        updateVotesHandlerSlate(slate.slateId, +newVotes)
      }
      disabled={isDisabledSlate}
      otherVotes={Number(props.TOTALVotosGLOBAL)}
      name={slate.slateName}
      imageURL={
        slate.slateImageURL ? slate.slateImageURL : props.myPartyImageURL
      }
      maxValue={500}
      currentGlobalVotes={votosSlateTotal}
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
        onSubmit={formSubmitHandlerSlate}
        style={{ paddingBottom: "4rem" }}
      >
        <CRow className="justify-content-center">
          {props.isLoading ? (
            <LoadingSpinner />
          ) : reduxSelectedCircuit && reduxSelectedCircuit.circuitId > 0 ? (
            slateList1
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
export default FormSlate2;
