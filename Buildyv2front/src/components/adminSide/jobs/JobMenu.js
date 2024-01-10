import React, { useState, useEffect } from "react";
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
import {
  faPlus,
  faEye,
  faTrowelBricks,
  faCamera,
  faFile,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

import useBumpEffect from "../../../utils/useBumpEffect";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import { fetchJobList } from "../../../store/generalData-actions";

import "./JobMenu.css";

const buttonColor = "dark";

const JobMenu = () => {
  //#region Consts ***********************************

  const [isBumped, triggerBump] = useBumpEffect();
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);

  const [jobList, setJobList] = useState([]);
  const reduxJobList = useSelector((state) => state.generalData.jobList) || [];

  useEffect(() => {
    setJobList(reduxJobList);
  }, [reduxJobList]);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.userEmail);
  useEffect(() => {
    if (!userEmail) {
      dispatch(authActions.logout());
      navigate("/login");
    }
  }, [userEmail, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  const filteredJobList = jobList.filter((job) => {
    const match1 = job.name
      ? job.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match2 =
      job.estate && job.estate.name
        ? job.estate.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
    const match3 =
      job.estate && job.estate.address
        ? job.estate.address.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
    const match4 = job.comments
      ? job.comments.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return match1 || match2 || match3 || match4;
  });

  useEffect(() => {
    // setPageCount(Math.ceil(filteredEstateList.length / itemsPerPage));
  }, [filteredJobList]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bumpHandler = () => {
    triggerBump();
    dispatch(fetchJobList());

    setTimeout(() => {
      navigate("/abm-job");
    }, 200); // Asegúrate de que este tiempo coincida o sea ligeramente mayor que la duración de tu animación
  };

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const renderJobRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentJobs = filteredJobList.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return currentJobs.map((job, index) => {
      // Formatear la fecha del trabajo, si es necesario
      const formattedDate = job.month; // Reemplazar con lógica de formateo si job.month es una fecha

      // Crear una cadena con todos los nombres de los trabajadores
      const workerNames =
        job.listWorkers && job.listWorkers.length > 0
          ? job.listWorkers.map((worker) => worker.name).join(", ")
          : "No asignado";

      return (
        <tr key={job.id}>
          <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
          <td>{formattedDate}</td>
          <td>{job.estate?.name}</td>
          <td>{job.estate?.address}</td>
          <td>{job.name}</td>
          <td>{workerNames}</td>
          <td>{job.comments}</td>
          <td>
            <button
              onClick={() => navigateToProperty(job)}
              style={{ border: "none", background: "none" }}
              className={isBumped ? "bump" : ""}
            >
              <FontAwesomeIcon icon={faEye} color="#697588" />
            </button>
            <button
              onClick={() => navigateToWorks(job)}
              style={{ border: "none", background: "none" }}
              className={isBumped ? "bump" : ""}
            >
              <FontAwesomeIcon icon={faTrowelBricks} color="#697588" />
            </button>
            <button
              onClick={() => navigateToReports(job)}
              style={{ border: "none", background: "none" }}
              className={isBumped ? "bump" : ""}
            >
              <FontAwesomeIcon icon={faCamera} color="#697588" />
            </button>
            <button
              onClick={() => navigateToRent(job)}
              style={{ border: "none", background: "none" }}
              className={isBumped ? "bump" : ""}
            >
              <FontAwesomeIcon icon={faFile} color="#697588" />
            </button>
          </td>
        </tr>
      );
    });
  };

  // Determinar el rango de páginas a mostrar alrededor de la página actual
  const pagesToShow = 3; // Ajusta este número según sea necesario
  let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
  let endPage = Math.min(startPage + pagesToShow - 1, pageCount);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(endPage - pagesToShow + 1, 1);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  function navigateToProperty(job) {
    navigate("/abm-job", { state: { job, editMode: true } });
  }

  function navigateToWorks(job) {
    navigate("/workMenu", { state: { job } });
  }

  function navigateToReports(job) {
    navigate("/reportMenu", { state: { job } });
  }

  function navigateToRent(job) {
    navigate("/rentMenu", { state: { job } });
  }

  //#endregion Functions ***********************************

  //#region Events ***********************************

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
            Panel de obras
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <CFormInput
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ maxWidth: "300px" }}
              />
              &nbsp;
              <button
                onClick={bumpHandler}
                style={{ border: "none", background: "none" }}
                className={isBumped ? "bump" : ""}
              >
                <FontAwesomeIcon icon={faPlus} color="#697588" />
              </button>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <div className="custom-table-responsive">
              <CTable striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Casa</th>
                    <th>Dirección</th>
                    <th>Obra</th>
                    <th>Trabajadores</th>
                    <th>Comentarios</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>{renderJobRows()}</tbody>
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

export default JobMenu;
