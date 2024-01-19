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
import { faPlus, faEye, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import useBumpEffect from "../../../utils/useBumpEffect";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import { fetchWorkerList } from "../../../store/generalData-actions";

import "./WorkerMenu.css";

const WorkerMenu = () => {
  //#region Consts ***********************************

  const [isBumped, triggerBump] = useBumpEffect();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);

  const [workerList, setWorkerList] = useState([]);
  const reduxWorkerList =
    useSelector((state) => state.generalData.workerList) || [];

  useEffect(() => {
    setWorkerList(reduxWorkerList);
  }, [reduxWorkerList]);

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

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
  };

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  const filteredWorkerList = workerList.filter((worker) => {
    const match1 = worker.name
      ? worker.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match2 = worker.phone
      ? worker.phone.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match3 = worker.email
      ? worker.email.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match4 = worker.identityDocument
      ? worker.identityDocument.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match5 = worker.comments
      ? worker.comments.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return match1 || match2 || match3 || match4 || match5;
  });

  useEffect(() => {
    setPageCount(Math.ceil(filteredWorkerList.length / itemsPerPage));
  }, [filteredWorkerList, itemsPerPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bumpHandler = () => {
    triggerBump();
    dispatch(fetchWorkerList());

    setTimeout(() => {
      navigate("/abm-worker");
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
    let sortableList = [...filteredWorkerList];
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
  }, [filteredWorkerList, sortConfig]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const renderWorkerRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Cambio de filteredTenantList a sortedList
    const currentWorkers = sortedList.slice(indexOfFirstItem, indexOfLastItem);

    return currentWorkers.map((worker, index) => (
      <tr key={worker.id}>
        <td
          style={worker.id === selectedWorker?.id ? { color: "blue" } : null}
          onClick={() => handleSelectWorker(worker)}
        >
          <button
            style={{
              border: "none",
              background: "none",
              padding: 0,
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => handleSelectWorker(worker)}
          >
            {index + 1}
          </button>
        </td>
        <td
          style={worker.id === selectedWorker?.id ? { color: "blue" } : null}
          onClick={() => handleSelectWorker(worker)}
        >
          {worker.name}
        </td>
        <td
          style={worker.id === selectedWorker?.id ? { color: "blue" } : null}
          onClick={() => handleSelectWorker(worker)}
        >
          {worker.phone}
        </td>
        <td
          style={worker.id === selectedWorker?.id ? { color: "blue" } : null}
          onClick={() => handleSelectWorker(worker)}
        >
          {worker.email}
        </td>
        <td
          style={worker.id === selectedWorker?.id ? { color: "blue" } : null}
          onClick={() => handleSelectWorker(worker)}
        >
          {worker.identityDocument}
        </td>
        <td
          style={worker.id === selectedWorker?.id ? { color: "blue" } : null}
          onClick={() => handleSelectWorker(worker)}
        >
          {worker.comments}
        </td>
        <td>
          <button
            onClick={() => navigateToProperty(worker)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
            title="Ver detalles"
          >
            <FontAwesomeIcon icon={faEye} color="#697588" />
          </button>
          <button
            onClick={() => sendWhatsApp(worker.phone)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
            title="Contactar por WhatsApp"
          >
            <FontAwesomeIcon icon={faPaperPlane} color="#697588" />
          </button>
        </td>
      </tr>
    ));
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

  function navigateToProperty(worker) {
    navigate("/abm-worker", { state: { worker, editMode: true } });
  }

  const sendWhatsApp = (phone) => {
    let whatsappLink;
    let phoneString = String(phone);

    // Si el número tiene 9 dígitos, quita el primer dígito y agrega el prefijo
    if (phoneString.length === 9) {
      whatsappLink = `https://api.whatsapp.com/send/?phone=598${phoneString.substring(
        1
      )}`;
    }
    // Si el número tiene 8 dígitos, se usa como viene
    else if (phoneString.length === 8) {
      whatsappLink = `https://api.whatsapp.com/send/?phone=598${phoneString}`;
    }
    // En caso de que el número no tenga 8 o 9 dígitos, muestra un mensaje de error
    else {
      console.log("Número de teléfono inválido para WhatsApp");
      return;
    }

    // Abrir el enlace de WhatsApp
    window.open(whatsappLink, "_blank");
  };

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
            Panel de trabajadores
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
                      onClick={() => requestSort("name")}
                    >
                      Nombre
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("phone")}
                    >
                      Celular
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("email")}
                    >
                      Email
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("identityDocument")}
                    >
                      Cédula
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
                <tbody>{renderWorkerRows()}</tbody>
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

export default WorkerMenu;
