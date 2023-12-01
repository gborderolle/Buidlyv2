import React, { useState, useEffect, useReducer } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { loginGeneralHandler } from "../../../store/auth-actions";
import { authActions } from "../../../store/auth-slice";

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSidebarBrand,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";

import logo from "src/assets/images/datalexion-logo-big.png";
import { sygnet } from "src/assets/brand/sygnet";

import classes from "./LoginGeneral.module.css";

//#region Functions

const emailReducer = (state, action) => {
  if (action.type == "USER_INPUT") {
    return { value: action.val };
    // return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type == "INPUT_BLUR") {
    return { value: state.value };
    // return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type == "USER_INPUT") {
    return { value: action.val, isValid: true };
    // return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type == "INPUT_BLUR") {
    return { value: state.value, isValid: true };
    // return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const isMobileDevice = () => {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
};

//#endregion Functions

const buttonColor = "dark";

const LoginGeneral = () => {
  //#region Consts

  const [isMobile] = useState(isMobileDevice());

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(authActions.setIsMobile(isMobile)); // Suponiendo que tienes una acción para esto
  }, [isMobile]);

  // Redux call actions
  const dispatch = useDispatch();

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });

  const cardBodyVariantsDesktop = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const cardBodyVariantsMobile = {
    hidden: { y: "-100%" },
    visible: { y: 0 },
  };

  //#endregion Consts

  //#region Hooks

  useEffect(() => {
    // redux call
    dispatch(authActions.resetAuthState());
  }, []);

  //#endregion Hooks

  //#region Functions

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(
      loginGeneralHandler(emailState.value, passwordState.value, navigate)
    );
  };

  //#endregion Functions

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={submitHandler}>
                    <h1>Dashboard</h1>
                    <p className="text-medium-emphasis">Analistas</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Usuario"
                        onBlur={validateEmailHandler}
                        onChange={emailChangeHandler}
                        value={emailState.value}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        onBlur={validatePasswordHandler}
                        onChange={passwordChangeHandler}
                        value={passwordState.value}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol
                        xs={12}
                        style={{ margin: "auto", textAlign: "center" }}
                      >
                        <CButton
                          color={buttonColor}
                          type="submit"
                          className="px-4"
                        >
                          Login
                        </CButton>
                      </CCol>
                      <br />
                      <CButton color="link" className="px-0">
                        ¿Olvidó la contraseña?
                      </CButton>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className={`bg ${classes.loginRight}`}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  transition={{ type: "spring", bounce: 0.7, duration: 2 }}
                  variants={
                    isMobile ? cardBodyVariantsMobile : cardBodyVariantsDesktop
                  }
                >
                  <CCard className={`p-3 text-white bg-primary py-5`}>
                    <CCardBody className="text-center">
                      <div>
                        <CSidebarBrand className="d-md-flex" to="/">
                          <CImage fluid src={logo} width={150} />
                          <CIcon
                            className="sidebar-brand-narrow"
                            icon={sygnet}
                            height={35}
                          />
                        </CSidebarBrand>
                        <p className={classes.p}>
                          Con Buildy, los usuarios pueden realizar diversas
                          tareas relacionadas con la administración de
                          propiedades de manera centralizada.
                        </p>
                      </div>
                    </CCardBody>
                  </CCard>
                </motion.div>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LoginGeneral;
