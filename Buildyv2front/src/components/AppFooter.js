import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter = (props) => {
  return (
    <CFooter>
      <div className={props.className} style={{ textAlign: "center" }}>
        <a
          href="https://datalexion.uy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datalexion
        </a>
        <span className="ms-1">
          &copy; Todos los derechos reservados, 2023.
        </span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
