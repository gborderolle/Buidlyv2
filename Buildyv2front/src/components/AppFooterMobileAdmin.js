import React from "react";

import { CRow, CFooter } from "@coreui/react";
import {
  cilFeaturedPlaylist,
  cilMap,
  cilChartPie,
  cilTags,
  cilCog,
  cilPeople,
} from "@coreui/icons";

import CustomButton from "./CustomButton";

import classes from "./AppFooterMobileAdmin.module.css";

const AppFooterMobileAdmin = (props) => {
  const buttonsConfig = [
    {
      icon: cilChartPie,
      color: "info",
      requiredRoleNumber: 1,
      path: "/dashboard",
    },
    { icon: cilMap, color: "info", requiredRoleNumber: 1, path: "/maps" },
    { icon: cilPeople, color: "info", requiredRoleNumber: 1, path: "/delegates" },
    { icon: cilTags, color: "info", requiredRoleNumber: 1, path: "/datos" },
    { icon: cilCog, color: "info", requiredRoleNumber: 1, path: "/admin" },
    {
      icon: cilFeaturedPlaylist,
      color: "info",
      requiredRoleNumber: 2,
      path: "/form",
    },
  ];

  return (
    <CFooter className={`${classes.footer} ${classes.fixedFooter}`}>
      <CRow className={classes.buttonContainer}>
        {buttonsConfig.map((button, index) => (
          <CustomButton
            key={index}
            icon={button.icon}
            color="dark"
            path={button.path}
            userRoleNumber={props.userRoleNumber}
            requiredRoleNumber={button.requiredRoleNumber}
          />
        ))}
      </CRow>
    </CFooter>
  );
};

export default React.memo(AppFooterMobileAdmin);
