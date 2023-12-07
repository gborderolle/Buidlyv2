import FooterAlert from "./FooterAlert";

import { CBadge, CCardFooter } from "@coreui/react";

import useHighlightedState from "../../../utils/useHighlightedState";

import classes from "./Footer.module.css";

const Footer = (props) => {
  const [isHighlighted] = useHighlightedState(false, props.labelVotesVALOR);

  const createBadgeClass = (isHighlighted) =>
    `headerBadge ${isHighlighted ? classes.bump : ""}`;

  const buttonClass = createBadgeClass(isHighlighted);

  return (
    <>
      <CCardFooter
        className="text-medium-emphasis p-1"
        style={{ textAlign: "center" }}
      >
        {props.useAlert && (
          <FooterAlert
            isValid={props.isValidForm}
            isSuccess={props.isSuccess}
            errorMsg="El formulario no es válido."
            successMsg="Datos enviados correctamente."
          />
        )}
        <h6>
          {props.labelText}&nbsp;
          <CBadge
            color={props.labelStyle}
            className={buttonClass}
            style={{ fontSize: "inherit" }}
          >
            {props.labelVotesVALOR}
          </CBadge>
        </h6>
      </CCardFooter>
    </>
  );
};

export default Footer;
