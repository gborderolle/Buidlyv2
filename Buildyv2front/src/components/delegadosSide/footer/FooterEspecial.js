import React from "react";
import FooterAlert from "./FooterAlert";

import { CBadge, CCardFooter } from "@coreui/react";

import useHighlightedState from "../../../utils/useHighlightedState";

// redux imports
import { useSelector } from "react-redux";

import classes from "./Footer.module.css";

const FooterEspecial = (props) => {
  //#region Consts ***********************************

  // redux get
  const stepSummaryIsVisible = useSelector(
    (state) => state.ui.stepSummaryIsVisible
  );

  const [isHighlighted] = useHighlightedState(false, props.labelVotesVALOR);

  const createBadgeClass = (isHighlighted) =>
    `headerBadge ${isHighlighted ? classes.bump : ""}`;

  const buttonClass = createBadgeClass(isHighlighted);

  //#endregion Consts ***********************************

  return (
    <>
      <CCardFooter
        className="text-medium-emphasis p-1"
        style={{
          textAlign: "center",
          display: "flex", // Establece el contenedor como flex
          justifyContent: "center", // Alinea los elementos hijos horizontalmente en el centro
          alignItems: "center", // Alinea los elementos hijos verticalmente en el centro
        }}
      >
        {!stepSummaryIsVisible && (
          <>
            <div style={{ margin: "0 10px" }}>
              {" "}
              {/* Añade margen a los div para separarlos */}
              {props.useAlert && (
                <FooterAlert
                  isValid={props.isValidForm1}
                  isSuccess={props.isSuccess1}
                  errorMsg="El formulario no es válido."
                  successMsg="Datos enviados correctamente."
                />
              )}
              <h6>
                {props.labelText1}&nbsp;
                <CBadge
                  color={props.labelStyle1}
                  className={buttonClass}
                  style={{ fontSize: "inherit" }}
                >
                  {props.labelVotesVALOR1}
                </CBadge>
              </h6>
            </div>
            <div style={{ margin: "0 10px" }}>
              {" "}
              {/* Añade margen a los div para separarlos */}
              {props.useAlert && (
                <FooterAlert
                  isValid={props.isValidForm2}
                  isSuccess={props.isSuccess2}
                  errorMsg="El formulario no es válido."
                  successMsg="Datos enviados correctamente."
                />
              )}
              <h6>
                {props.labelText2}&nbsp;
                <CBadge
                  color={props.labelStyle2}
                  className={buttonClass}
                  style={{ fontSize: "inherit" }}
                >
                  {props.labelVotesVALOR2}
                </CBadge>
              </h6>
            </div>
          </>
        )}

        {stepSummaryIsVisible && (
          <>
            <div style={{ margin: "0 10px" }}>
              {" "}
              {/* Añade margen a los div para separarlos */}
              {props.useAlert && (
                <FooterAlert
                  isValid={props.isValidForm2}
                  isSuccess={props.isSuccess2}
                  errorMsg="El formulario no es válido."
                  successMsg="Datos enviados correctamente."
                />
              )}
              <h6>
                {props.labelText3}&nbsp;
                <CBadge
                  color={props.labelStyle2}
                  className={buttonClass}
                  style={{ fontSize: "inherit" }}
                >
                  {props.labelVotesVALOR2}
                </CBadge>
              </h6>
            </div>
          </>
        )}
      </CCardFooter>
    </>
  );
};

export default FooterEspecial;
