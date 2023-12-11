import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CFormInput,
  CTable,
  CPagination,
  CPaginationItem,
} from "@coreui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

import useBumpEffect from "../../../utils/useBumpEffect";

// redux imports
import { batch, useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import {
  fetchEstates,
  fetchJobs,
  fetchRents,
  fetchWorkers,
} from "../../../store/generalData-actions";

import "./DelegatesMenu.css";

const DelegatesMenu = () => {
  //#region Consts ***********************************

  const [isBumped, triggerBump] = useBumpEffect();
  const [searchTerm, setSearchTerm] = useState("");

  // redux init
  const dispatch = useDispatch();

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const userRoleNumber = useSelector((state) => state.auth.userRoleNumber);
  useEffect(() => {
    const USER_ROLE_ID = 1;
    if (userRoleNumber != USER_ROLE_ID) {
      dispatch(authActions.logout());
      navigate("/login");
    }
  }, [userRoleNumber, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  // redux gets
  const [provinceList, setProvinceList] = useState([]);
  const reduxProvinceList = useSelector(
    (state) => state.generalData.provinceList
  );

  const [municipalityList, setMunicipalityList] = useState([]);
  const reduxMunicipalityList = useSelector(
    (state) => state.generalData.municipalityList
  );

  const [circuitList, setCircuitList] = useState([]);
  const reduxCircuitList = useSelector(
    (state) => state.generalData.circuitList
  );

  const [delegateList, setDelegateList] = useState([]);
  const reduxDelegateList = useSelector(
    (state) => state.generalData.delegateList
  );

  // pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Ajusta este número según tus necesidades
  const [pageCount, setPageCount] = useState(0);

  const getCircuitNumbersForDelegate = (delegadoId) => {
    return circuitList
      .filter((circuit) => circuit.lastUpdateDelegadoId === delegadoId)
      .map((circuit) => circuit.circuitNumber.toString());
  };

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  // redux gets
  useEffect(() => {
    setProvinceList(reduxProvinceList);
    setMunicipalityList(reduxMunicipalityList);
    setCircuitList(reduxCircuitList);
    setDelegateList(reduxDelegateList);
  }, [reduxCircuitList, reduxDelegateList]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  // Función para obtener el nombre de la provincia por su ID
  const getProvinceNameById = (provinceId) => {
    const province = provinceList.find((p) => p.provinceId === provinceId);
    return province ? province.provinceName : "N/A";
  };

  // Función para obtener el nombre del municipio por su ID
  const getMunicipalityNameById = (municipalityId) => {
    const municipality = municipalityList.find(
      (m) => m.municipalityId === municipalityId
    );
    return municipality ? municipality.municipalityName : "N/A";
  };

  // Filtra los delegados en función del término de búsqueda
  const filteredDelegateList = delegateList.filter((delegate) => {
    const ciMatch = delegate.delegadoCI?.includes(searchTerm);
    const nameMatch = delegate.delegadoName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const phoneMatch = delegate.delegadoPhone?.includes(searchTerm);

    const provinceName = getProvinceNameById(
      delegate.delegadoProvinceId
    )?.toLowerCase();
    const municipalityName = getMunicipalityNameById(
      delegate.municipalityId
    )?.toLowerCase();

    const provinceMatch = provinceName?.includes(searchTerm.toLowerCase());
    const municipalityMatch = municipalityName?.includes(
      searchTerm.toLowerCase()
    );

    // Nueva lógica para circuitNumber
    const circuitNumbers = getCircuitNumbersForDelegate(delegate.delegadoId);
    const circuitMatch = circuitNumbers.some((number) =>
      number.includes(searchTerm)
    );

    return (
      ciMatch ||
      nameMatch ||
      phoneMatch ||
      provinceMatch ||
      municipalityMatch ||
      circuitMatch
    );
  });

  // pagination logic
  useEffect(() => {
    setPageCount(Math.ceil(filteredDelegateList.length / itemsPerPage));
  }, [filteredDelegateList]);

  // Determinar el rango de páginas a mostrar alrededor de la página actual
  const pagesToShow = 3; // Ajusta este número según sea necesario
  let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
  let endPage = Math.min(startPage + pagesToShow - 1, pageCount);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(endPage - pagesToShow + 1, 1);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDelegates = filteredDelegateList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Función para obtener los circuitos de un delegado específico
  const getCircuitsForDelegate = (delegadoId) => {
    return circuitList
      .filter((circuit) => circuit.lastUpdateDelegadoId === delegadoId)
      .map((circuit) => circuit.circuitNumber)
      .join(", ");
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // pagination logic
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bumpHandler = () => {
    triggerBump();

    const fetchGeneralData = async () => {
      batch(() => {
        dispatch(fetchEstates());
        dispatch(fetchJobs());
        dispatch(fetchRents());
        dispatch(fetchWorkers());
      });
    };
    fetchGeneralData();
  };

  //#endregion Events ***********************************

  //#region JSX ***********************************

  // Renderiza cada fila de la tabla para los delegados filtrados
  const renderDelegateRows = () => {
    return filteredDelegateList.map((delegate, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{delegate.delegadoCI}</td>
        <td>{delegate.delegadoName}</td>
        <td>{delegate.delegadoPhone}</td>
        <td>{getProvinceNameById(delegate.delegadoProvinceId)}</td>
        <td>{getMunicipalityNameById(delegate.municipalityId)}</td>
        <td>{getCircuitsForDelegate(delegate.delegadoId)}</td>
      </tr>
    ));
  };

  //#endregion JSX ***********************************

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Panel general
            <CFormInput
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ maxWidth: "300px" }} // O el ancho que prefieras
            />
            <button
              onClick={bumpHandler}
              style={{ border: "none", background: "none" }}
              className={isBumped ? "bump" : ""}
            >
              <FontAwesomeIcon icon={faRefresh} color="#697588" />
            </button>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <div className="custom-table-responsive">
              <CTable striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cédula</th>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Departamento</th>
                    <th>Municipio</th>
                    <th>Circuitos</th>
                  </tr>
                </thead>
                <tbody>{renderDelegateRows()}</tbody>
              </CTable>
            </div>
          </CRow>
          <CPagination align="center" aria-label="Page navigation example">
            {startPage > 1 && (
              <CPaginationItem onClick={() => handlePageChange(1)}>
                1
              </CPaginationItem>
            )}
            {startPage > 2 && <CPaginationItem>...</CPaginationItem>}
            {[...Array(endPage - startPage + 1)].map((_, index) => (
              <CPaginationItem
                key={startPage + index}
                active={startPage + index === currentPage}
                onClick={() => handlePageChange(startPage + index)}
              >
                {startPage + index}
              </CPaginationItem>
            ))}
            {endPage < pageCount - 1 && <CPaginationItem>...</CPaginationItem>}
            {endPage < pageCount && (
              <CPaginationItem onClick={() => handlePageChange(pageCount)}>
                {pageCount}
              </CPaginationItem>
            )}
          </CPagination>
        </CCardBody>
      </CCard>
    </>
  );
};

export default DelegatesMenu;
