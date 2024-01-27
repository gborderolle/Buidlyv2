import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CCard, CCardBody, CCol, CCardHeader, CRow } from "@coreui/react";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

// redux imports
import { useSelector, useDispatch, batch } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import {
  fetchEstateList,
  fetchProvinceList,
} from "../../../store/generalData-actions";

import EstateMap from "./EstateMap";

import "./MapDashboard.css";

const MapDashboard = () => {
  //#region Consts ***********************************

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCircuit, setSelectedCircuit] = useState(null);

  const [searchProvince, setSearchProvince] = useState("");
  const [searchCircuit, setSearchCircuit] = useState("");

  // redux init
  const dispatch = useDispatch();

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const username = useSelector((state) => state.auth.username);
  useEffect(() => {
    if (!username) {
      dispatch(authActions.logout());
      navigate("/login");
    }
  }, [username, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  // redux gets
  const [estateList, setEstateList] = useState([]);
  const reduxEstateList =
    useSelector((state) => state.generalData.estateList) || [];

  const [provinceList, setProvinceList] = useState([]);
  const reduxProvinceList = useSelector(
    (state) => state.generalData.provinceList
  );

  const dropdownVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5, type: "spring", stiffness: 120 },
    },
    closed: { opacity: 0, height: 0, transition: { duration: 0.5 } },
  };

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  // redux gets
  useEffect(() => {
    setProvinceList(reduxProvinceList);
    setEstateList(reduxEstateList);
  }, [reduxProvinceList, reduxEstateList]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    console.log("Nuevo filtro seleccionado:", event.target.value); // para depuración
  };

  const updateHandler = () => {
    const fetchGeneralData = async () => {
      batch(() => {
        dispatch(fetchEstateList());
        dispatch(fetchProvinceList());
      });
    };
    fetchGeneralData();
  };

  //#endregion Events ***********************************

  const filterVariants = {
    hidden: {
      y: -20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <motion.div initial="closed" animate="open" variants={dropdownVariants}>
        <CCard className="mb-4" style={{ paddingBottom: "4rem" }}>
          <CCardHeader>
            Distribución geográfica
            <button
              onClick={updateHandler}
              style={{ border: "none", background: "none", float: "right" }}
            >
              <FontAwesomeIcon icon={faRefresh} color="#697588" />{" "}
            </button>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={9} md={9} lg={9} xl={9}>
                <EstateMap estateList={estateList} />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </motion.div>
    </>
  );
};

export default MapDashboard;
