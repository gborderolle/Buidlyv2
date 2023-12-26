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

  const filteredTenantList = tenantList.filter((tenant) => {
    const nameMatch = tenant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const addressMatch = tenant.address
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const rentedMatch =
      tenant.rented !== undefined
        ? tenant.rented
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false;
    return nameMatch || addressMatch || rentedMatch;
  });

  useEffect(() => {
    // setPageCount(Math.ceil(filteredEstateList.length / itemsPerPage));
  }, [filteredTenantList]);

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

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const renderTenantRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTenants = filteredTenantList.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

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
    navigate("/abm-job", { state: { tenant, editMode: true } });
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
                    <th>Nombre</th>
                    <th>Celular 1</th>
                    <th>Celular 2</th>
                    <th>Email</th>
                    <th>Cédula</th>
                    <th>Comentarios</th>
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
