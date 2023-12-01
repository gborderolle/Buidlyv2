import React, { useEffect, useState } from "react";

import { CRow, CFooter } from "@coreui/react";

import Footer from "../views/form/footer/Footer";
import FooterEspecial from "../views/form/footer/FooterEspecial";
import Stepper from "./stepper/Stepper";
import BtnSeleccionarCircuito from "../views/form/selectDDL/SelectCircuitButton";

// redux imports
import { useSelector } from "react-redux";

import classes from "./AppFooterMobileDelegados.module.css";

const AppFooterMobileDelegados = () => {
  //#region Consts ***********************************

  // redux get
  const TOTALVotosGLOBAL = useSelector((state) => state.form.TOTALVotosGLOBAL);
  const votosSlateTotalRedux = useSelector(
    (state) => state.form.votosSlateTotalRedux
  );
  const votosPartyTotalRedux = useSelector(
    (state) => state.form.votosPartyTotalRedux
  );
  const votosExtrasTotalRedux = useSelector(
    (state) => state.form.votosExtrasTotalRedux
  );
  const stepperIsVisible = useSelector((state) => state.ui.stepperIsVisible);

  // redux get
  const reduxSelectedCircuitId = useSelector(
    (state) => state.liveSettings.circuitId
  );

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  return (
    <CFooter className={`${classes.footer} ${classes.fixedFooter}`}>
      {(!reduxSelectedCircuitId ||
        reduxSelectedCircuitId === 0 ||
        !stepperIsVisible) && (
        <div style={{ textAlign: "center" }}>
          <BtnSeleccionarCircuito />
        </div>
      )}

      {/* Resto del contenido que ya estaba en el footer */}
      {stepperIsVisible && (
        <>
          <FooterEspecial
            labelText1="Votos parciales:"
            labelVotesVALOR1={TOTALVotosGLOBAL}
            labelStyle1={"success"}
            labelText2="Acumulado:"
            labelVotesVALOR2={
              votosSlateTotalRedux +
              votosPartyTotalRedux +
              votosExtrasTotalRedux
            }
            labelStyle2={"info"}
            labelText3="Cantidad de votos totales:"
          />
          <div className="bg-gray-900 flex flex-row gap-10 items-center justify-center">
            <div className="bg-gray-900 flex flex-row gap-10 items-center justify-center">
              <Stepper />
            </div>
          </div>
        </>
      )}
    </CFooter>
  );
};

export default React.memo(AppFooterMobileDelegados);
