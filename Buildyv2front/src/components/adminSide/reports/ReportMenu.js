import React, { useState, useEffect, useMemo } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

import useBumpEffect from "../../../utils/useBumpEffect";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import { fetchReportList } from "../../../store/generalData-actions";

import "./ReportMenu.css";

const ReportMenu = () => {
  //#region Consts ***********************************

  const location = useLocation();
  const estate = location.state?.estate;
  const listMode = location.state?.listMode ? location.state?.listMode : false;

  const [isBumped, triggerBump] = useBumpEffect();
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);

  const [reportList, setReportList] = useState([]);
  const reduxReportList =
    useSelector((state) => state.generalData.reportList) || [];

  useEffect(() => {
    // Si listMode es true, usar solo los trabajos de la propiedad específica
    if (listMode && estate && estate.listReports) {
      setReportList(estate.listReports);
    } else {
      // Si listMode no es true, usar la lista completa de trabajos
      setReportList(reduxReportList);
    }
  }, [reduxReportList, estate, listMode]);

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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

  const filteredReportList = reportList.filter((report) => {
    const match1 = report.name
      ? report.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match2 =
      report.estate && report.estate.name
        ? report.estate.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
    const match3 =
      report.estate && report.estate.address
        ? report.estate.address.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
    const match4 = report.comments
      ? report.comments.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return match1 || match2 || match3 || match4;
  });

  useEffect(() => {
    setPageCount(Math.ceil(filteredReportList.length / itemsPerPage));
  }, [filteredReportList, itemsPerPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bumpHandler = () => {
    triggerBump();
    dispatch(fetchReportList());

    setTimeout(() => {
      navigate("/abm-report");
    }, 200); // Asegúrate de que este tiempo coincida o sea ligeramente mayor que la duración de tu animación
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Aplicar el ordenamiento a los datos
  const sortedList = useMemo(() => {
    let sortableList = [...filteredReportList];
    if (sortConfig.key !== null) {
      sortableList.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableList;
  }, [filteredReportList, sortConfig]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const renderReportRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Cambio de filteredTenantList a sortedList
    const currentReports = sortedList.slice(indexOfFirstItem, indexOfLastItem);

    return currentReports.map((report, index) => {
      // Parsear la fecha y formatearla como Año/Mes
      const reportDate = new Date(report.month);
      const formattedDate = `${reportDate.getFullYear()}/${(
        "0" +
        (reportDate.getMonth() + 1)
      ).slice(-2)}`; // Añade un cero delante para los meses de un solo dígito

      return (
        <tr key={report.id}>
          <td>{index + 1}</td>
          <td>{formattedDate}</td> {/* Usar la fecha formateada */}
          <td>{report.estate?.name}</td>
          <td>{report.estate?.address}</td>
          <td>{report.name}</td>
          <td>{report.listPhotosURL?.length}</td>
          <td>{report.comments}</td>
          <td>
            <button
              onClick={() => navigateToReport(report)}
              style={{ border: "none", background: "none" }}
              className={isBumped ? "bump" : ""}
              title="Ver detalles"
            >
              <FontAwesomeIcon icon={faEye} color="#697588" />
            </button>
            <button
              onClick={() => navigateToAlbum(report)}
              style={{ border: "none", background: "none" }}
              className={isBumped ? "bump" : ""}
              title="Ver álbum"
            >
              <FontAwesomeIcon icon={faCamera} color="#697588" />
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

  function navigateToReport(report) {
    navigate("/abm-report", { state: { report, editMode: true } });
  }

  function navigateToAlbum(report) {
    navigate("/reportMenu", { state: { report } });
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
            Panel de reportes
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
                    <th
                      className="table-header"
                      onClick={() => requestSort("month")}
                    >
                      Fecha/mes
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("phone1")}
                    >
                      Casa
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("address")}
                    >
                      Dirección
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("phone1")}
                    >
                      Reporte
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("phone1")}
                    >
                      # Fotos
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("comments")}
                    >
                      Comentarios
                    </th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>{renderReportRows()}</tbody>
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

export default ReportMenu;
