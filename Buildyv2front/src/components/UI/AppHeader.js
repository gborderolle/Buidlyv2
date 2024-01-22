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
  const circuitDDLIsVisible = useSelector(
    (state) => state.ui.circuitDDLIsVisible.status
  );
  const provinceDDLIsVisible = useSelector(
    (state) => state.ui.provinceDDLIsVisible.status
  );
  const circuitNameIsVisible = useSelector(
    (state) => state.ui.circuitNameIsVisible.status
  );
  const reduxSelectedCircuit = useSelector(
    (state) => state.liveSettings.circuit
  );

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

  const [circuitList, setCircuitList] = useState(null);
  const [provinceList, setProvinceList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    const reloadHandler = () => {
      fetchProvinceData();
      fetchCircuitData();
      fetchSlateData();
    };

    window.addEventListener("beforeunload", reloadHandler);

    return () => {
      window.removeEventListener("beforeunload", reloadHandler);
    };
  }, []);

  useEffect(() => {
    fetchProvinceData();
    fetchCircuitData();
    fetchSlateData();
  }, []);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  async function fetchCircuitData() {
    try {
      // const dbRef = ref(database, "circuitList");
      // const snapshot = await get(dbRef);
      // const circuitList = snapshot.val();
      // if (circuitList) {
      //   const filteredCircuits = Object.values(circuitList).filter(
      //     (circuit) => circuit.provinceId == userProvinceId
      //   );
      //   setCircuitList(filteredCircuits);
      // }
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSlateData() {
    try {
      // const dbRef = ref(database, "slateList");
      // const snapshot = await get(dbRef);
      // const slateList = snapshot.val();
      // if (slateList) {
      //   setSlateList(Object.values(slateList));
      // }
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProvinceData() {
    try {
      // const dbRef = ref(database, "provinceList");
      // const snapshot = await get(dbRef);
      // const provinceList = snapshot.val();
      // if (provinceList) {
      //   setProvinceList(Object.values(provinceList));
      // }
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }

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

        {circuitNameIsVisible && reduxSelectedCircuit && (
          <div style={{ position: "relative" }}>
            <CBadge
              color="secondary"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {reduxSelectedCircuit.circuitId}:{" "}
              {reduxSelectedCircuit.circuitName}
            </CBadge>
          </div>
        )}

        {isMobile && circuitDDLIsVisible && (
          <div className={classes.selectDDLContainer}>
            <SelectDDL
              items={circuitList}
              label="Circuito"
              keyNumber="circuitNumber"
              keyName="circuitName"
              onSelect={(item) => {
                // redux set
                dispatch(liveSettingsActions.setSelectedCircuit(item));
              }}
              isMobile={isMobile}
            />
          </div>
        )}
        {isMobile && provinceDDLIsVisible && (
          <div className={classes.selectDDLContainer}>
            <SelectDDL
              items={provinceList}
              label="Departamento"
              keyNumber="provinceId"
              keyName="provinceName"
              onSelect={(item) => {
                // redux set
                dispatch(liveSettingsActions.setSelectedProvince(item));
              }}
              isMobile={isMobile}
            />
          </div>
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
      {!isMobile && circuitDDLIsVisible && (
        <CContainer fluid>
          <AppBreadcrumb>
            <SelectDDL
              items={circuitList}
              label="Circuito"
              keyNumber="circuitNumber"
              keyName="circuitName"
              onSelect={(item) => {
                // redux set
                dispatch(liveSettingsActions.setSelectedCircuit(item));
              }}
              isMobile={isMobile}
            />
          </AppBreadcrumb>
        </CContainer>
      )}
      {!isMobile && provinceDDLIsVisible && (
        <CContainer fluid>
          <AppBreadcrumb>
            <SelectDDL
              items={provinceList}
              label="Departamento"
              keyNumber="provinceId"
              keyName="provinceName"
              onSelect={(item) => {
                // redux set
                dispatch(liveSettingsActions.setSelectedProvince(item));
              }}
              isMobile={isMobile}
            />
          </AppBreadcrumb>
        </CContainer>
      )}
      {!isMobile && !circuitDDLIsVisible && !provinceDDLIsVisible && (
        <CContainer fluid>
          <AppBreadcrumb />
        </CContainer>
      )}
    </CHeader>
  );
};

export default AppHeader;
