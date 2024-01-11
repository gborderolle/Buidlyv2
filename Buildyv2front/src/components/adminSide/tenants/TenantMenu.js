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
import { fetchTenantList } from "../../../store/generalData-actions";

import "./TenantMenu.css";

const buttonColor = "dark";

const TenantMenu = () => {
  //#region Consts ***********************************

  const [isBumped, triggerBump] = useBumpEffect();
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);

  const [tenantList, setTenantList] = useState([]);
  const reduxTenantList =
    useSelector((state) => state.generalData.tenantList) || [];

  useEffect(() => {
    setTenantList(reduxTenantList);
  }, [reduxTenantList]);

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

  const filteredTenantList = tenantList.filter((tenant) => {
    const match1 = tenant.name
      ? tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match2 = tenant.phone1
      ? tenant.phone1.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match3 = tenant.email
      ? tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match4 = tenant.identityDocument
      ? tenant.identityDocument.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match5 = tenant.comments
      ? tenant.comments.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match6 = tenant.phone2
      ? tenant.phone2.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    return match1 || match2 || match3 || match4 || match5 || match6;
  });

  useEffect(() => {
    setPageCount(Math.ceil(filteredTenantList.length / itemsPerPage));
  }, [filteredTenantList, itemsPerPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bumpHandler = () => {
    triggerBump();
    dispatch(fetchTenantList());

    setTimeout(() => {
      navigate("/abm-tenant");
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
    let sortableList = [...filteredTenantList];
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
  }, [filteredTenantList, sortConfig]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const renderTenantRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Cambio de filteredTenantList a sortedList
    const currentTenants = sortedList.slice(indexOfFirstItem, indexOfLastItem);

    return currentTenants.map((tenant, index) => (
      <tr key={tenant.id}>
        <td>{index + 1}</td>
        <td>{tenant.name}</td>
        <td>{tenant.phone1}</td>
        <td>{tenant.phone2}</td>
        <td>{tenant.email}</td>
        <td>{tenant.identityDocument}</td>
        <td>{tenant.comments}</td>
        <td>
          <button
            onClick={() => navigateToProperty(tenant)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faEye} color="#697588" />
          </button>
          <button
            onClick={() => navigateToWorks(tenant)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faTrowelBricks} color="#697588" />
          </button>
          <button
            onClick={() => navigateToReports(tenant)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faCamera} color="#697588" />
          </button>
          <button
            onClick={() => navigateToRent(tenant)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faFile} color="#697588" />
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

  function navigateToProperty(tenant) {
    navigate("/abm-tenant", { state: { tenant, editMode: true } });
  }

  function navigateToWorks(tenant) {
    navigate("/workMenu", { state: { tenant } });
  }

  function navigateToReports(tenant) {
    navigate("/reportMenu", { state: { tenant } });
  }

  function navigateToRent(tenant) {
    navigate("/rentMenu", { state: { tenant } });
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
            Panel de inquilinos
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
                      onClick={() => requestSort("phone1")}
                    >
                      Celular 1
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("phone2")}
                    >
                      Celular 2
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
                <tbody>{renderTenantRows()}</tbody>
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

export default TenantMenu;
