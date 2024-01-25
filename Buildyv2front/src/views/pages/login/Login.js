import React, { useState, useEffect, useReducer } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// Redux imports
import { useDispatch } from "react-redux";
import { loginHandler } from "../../../store/auth-actions";
import { authActions } from "../../../store/auth-slice";
import {
  urlAccountBiometricChallenge,
  urlAccountBiometricValidate,
} from "../../../endpoints";

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import logo from "src/assets/images/Buildyv2-h.png";
import { sygnet } from "src/assets/brand/sygnet";

import classes from "./Login.module.css";

//#region Functions

const usernameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value };
  }
  return { value: "", isValid: false };
};

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

const Login = () => {
  //#region Consts

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobile] = useState(isMobileDevice());
  const [errorMessage, setErrorMessage] = useState("");

  const [supportsBiometrics, setSupportsBiometrics] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(authActions.setIsMobile(isMobile)); // Suponiendo que tienes una acción para esto
  }, [isMobile]);

  // Redux call actions
  const dispatch = useDispatch();

  const [usernameState, dispatchUsername] = useReducer(usernameReducer, {
    value: "",
    isValid: false,
  });

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

  useEffect(() => {
    if (isMobileDevice()) {
      if (navigator.credentials && navigator.credentials.create) {
        // Comprueba si el navegador soporta la API de credenciales
        setSupportsBiometrics(true);
      }
    }
  }, []);

  //#endregion Hooks

  //#region Functions

  const handleBiometricAuth = async () => {
    if (supportsBiometrics) {
      try {
        // Obtener challenge del servidor
        const challengeResponse = await fetch(urlAccountBiometricChallenge);
        const challengeData = await challengeResponse.json();

        const challengeArray = new Uint8Array(challengeData.challenge);
        const userIdArray = new Uint8Array(userId); // Convierte el userId a Uint8Array

        const publicKey = {
          challenge: challengeArray,
          rp: { name: "Nombre de tu aplicación" },
          user: {
            id: userIdArray,
            name: "nombre_de_usuario",
            displayName: "Nombre de Usuario",
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }],
          // Añade aquí las demás propiedades según la documentación de WebAuthn
        };

        const credential = await navigator.credentials.create({ publicKey });
        const credentialToSend = convertCredentialToServerFormat(credential);

        // Enviar la credencial al servidor para validarla
        const validateResponse = await fetch(urlAccountBiometricValidate, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentialToSend),
        });

        if (validateResponse.ok) {
          // Proceder con el inicio de sesión exitoso
          // Por ejemplo, almacenar el token de autenticación y redirigir al usuario
        } else {
          setErrorMessage("Error en la autenticación biométrica.");
        }
      } catch (error) {
        console.error("Error en la autenticación biométrica:", error);
        setErrorMessage("Error en la autenticación biométrica.");
      }
    }
  };

  function convertCredentialToServerFormat(credential) {
    return {
      id: credential.id,
      rawId: bufferToBase64(credential.rawId),
      response: {
        attestationObject: bufferToBase64(
          credential.response.attestationObject
        ),
        clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
      },
      type: credential.type,
    };
  }

  function bufferToBase64(buffer) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  }

  const usernameChangeHandler = (event) => {
    dispatchUsername({ type: "USER_INPUT", val: event.target.value });
  };

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateUsernameHandler = () => {
    dispatchUsername({ type: "INPUT_BLUR" });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsLoggingIn(true); // Activar el spinner
    dispatch(
      loginHandler(
        // emailState.value,
        usernameState.value, // Usar username en lugar de email
        passwordState.value,
        navigate,
        setErrorMessage
      )
    ).then(() => {
      setIsLoggingIn(false); // Desactivar el spinner una vez completado el login
    });
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
                    <p className="text-medium-emphasis">Login</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Nombre de usuario" // Cambiar placeholder
                        onBlur={validateUsernameHandler}
                        onChange={usernameChangeHandler}
                        value={usernameState.value}
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
                    {errorMessage && (
                      <div
                        className="alert alert-danger"
                        style={{ textAlign: "center" }}
                      >
                        {errorMessage}
                      </div>
                    )}
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
                          {isLoggingIn ? (
                            <FontAwesomeIcon icon={faSpinner} spin /> // Mostrar spinner cuando `isLoggingIn` es true
                          ) : (
                            <FontAwesomeIcon icon={faCheck} /> // Mostrar check cuando `isLoggingIn` es false
                          )}
                          &nbsp;Login
                        </CButton>
                        {supportsBiometrics && (
                          <CButton
                            color="primary"
                            onClick={handleBiometricAuth}
                            className="px-4"
                            style={{ marginLeft: "10px" }}
                          >
                            Huella Digital
                          </CButton>
                        )}
                      </CCol>
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

export default Login;
