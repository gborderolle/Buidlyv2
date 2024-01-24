import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { database, FirebaseUrls } from "../../utils/firebaseSetup";
import { get, ref } from "firebase/database";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { liveSettingsActions } from "../../store/liveSettings-slice";

import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CImage,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "../index";
import { AppHeaderDropdown } from "../header/index";

import logoSmall from "src/assets/images/datalexion-logo.png";
import logoBig from "src/assets/images/datalexion-logo-big.png";
import classes from "./AppHeader.css";

const AppHeader = () => {
  //#region Consts ***********************************

  // redux get
  const dispatch = useDispatch();

  // Redux get
  const sidebarShow = useSelector((state) => state.oldState.sidebarShow);
  const userRoleNumber = useSelector(
    (state) => state.loggedUser?.userRoleNumber || 0
  );
  const userProvinceId = useSelector(
    (state) => state.loggedUser?.provinceId || 0
  );

  // LocalStorage get
  const isMobile = JSON.parse(localStorage.getItem("isMobile"));

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  //#endregion Functions ***********************************

  //#region JSX ***********************************

  const headerStyle = isMobile
    ? {
        "--cui-header-bg": "#697588",
        color: "whitesmoke",
      }
    : {};

  const iconStyle = isMobile
    ? {
        "--ci-primary-color": "whitesmoke",
      }
    : {};

  //#endregion JSX ***********************************

  return (
    <CHeader position="sticky" className="mb-1" style={headerStyle}>
      <CContainer fluid>
        {isMobile ? (
          <CHeaderToggler
            className="ps-1"
            onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
            style={iconStyle}
          >
            <CImage
              fluid
              src={logoSmall}
              className={classes.CImage}
              width={70}
            />
          </CHeaderToggler>
        ) : (
          <CHeaderToggler
            className="ps-1"
            onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
            style={iconStyle}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
        )}

        <CHeaderNav className="d-none d-md-flex me-auto">
          {userRoleNumber == 2 && (
            <CNavItem>
              <CNavLink to="/form" component={NavLink}>
                Formulario
              </CNavLink>
            </CNavItem>
          )}
          {userRoleNumber == 1 && (
            <CNavItem>
              <CNavLink to="/dashboard" component={NavLink}>
                Dashboard
              </CNavLink>
            </CNavItem>
          )}
        </CHeaderNav>

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {!isMobile && <CHeaderDivider />}
    </CHeader>
  );
};

export default AppHeader;
