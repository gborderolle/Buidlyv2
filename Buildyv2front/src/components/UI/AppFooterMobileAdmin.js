import React from "react";
import { useLocation } from "react-router-dom";

import { CRow, CFooter } from "@coreui/react";
import {
  cilImage,
  cilBriefcase,
  cilPaint,
  cilPeople,
  cilHome,
} from "@coreui/icons";

import CustomButton from "./CustomButton";

import classes from "./AppFooterMobileAdmin.module.css";

const AppFooterMobileAdmin = (props) => {
  const location = useLocation();
  const buttonsConfig = [
    {
      title: "Propiedades",
      icon: cilHome,
      color: "info",
      path: "/estates",
    },
    {
      title: "Reportes",
      icon: cilImage,
      color: "info",
      path: "/reports",
    },
    {
      title: "Obras",
      icon: cilPaint,
      color: "info",
      path: "/jobs",
    },
    {
      title: "Inquilinos",
      icon: cilPeople,
      color: "info",
      path: "/tenants",
    },
    {
      title: "Trabajadores",
      icon: cilBriefcase,
      color: "info",
      path: "/workers",
    },
  ];

  return (
    <CFooter className={`${classes.footer} ${classes.fixedFooter}`}>
      <CRow className={classes.buttonContainer}>
        {buttonsConfig.map((button, index) => {
          const isActive = location.pathname === button.path;
          return (
            <CustomButton
              key={index}
              icon={button.icon}
              color={isActive ? "active" : "dark"}
              path={button.path}
              userRoleNumber={props.userRole}
            />
          );
        })}
      </CRow>
    </CFooter>
  );
};

export default React.memo(AppFooterMobileAdmin);
