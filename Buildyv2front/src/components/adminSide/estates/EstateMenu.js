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
import { fetchEstateList } from "../../../store/generalData-actions";

import "./EstateMenu.css";

const buttonColor = "dark";

const EstateMenu = () => {
  //#region Consts ***********************************

  const [isBumped, triggerBump] = useBumpEffect();
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);

  const [estateList, setEstateList] = useState([]);
  const reduxEstateList =
    useSelector((state) => state.generalData.estateList) || [];

  useEffect(() => {
    setEstateList(reduxEstateList);
  }, [reduxEstateList]);

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

  const filteredEstateList = estateList.filter((estate) => {
    const nameMatch = estate.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const addressMatch = estate.address
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const rentedMatch =
      estate.rented !== undefined
        ? estate.rented
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false;
    return nameMatch || addressMatch || rentedMatch;
  });

  useEffect(() => {
    // setPageCount(Math.ceil(filteredEstateList.length / itemsPerPage));
  }, [filteredEstateList]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bumpHandler = () => {
    triggerBump();
    dispatch(fetchEstateList());

    setTimeout(() => {
      navigate("/abm-estate");
    }, 200); // Asegúrate de que este tiempo coincida o sea ligeramente mayor que la duración de tu animación
  };

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const renderEstateRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEstates = filteredEstateList.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return currentEstates.map((estate, index) => (
      <tr key={estate.id}>
        <td>{index + 1}</td>
        <td>{estate.name}</td>
        <td>{estate.address}</td>
        <td>
          {estate.listRents &&
          estate.listRents.length > 0 &&
          estate.listRents[0].listTenants &&
          estate.listRents[0].listTenants.length > 0
            ? estate.listRents[0].listTenants[0].name
            : ""}
        </td>
        <td>
          {estate.PresentRentId > 0 && estate.listRents.length > 0 ? estate.listRents?.[0].MonthlyValue : ""}
        </td>
        <td>{estate.comments}</td>
        <td>
          <button
            onClick={() => navigateToProperty(estate)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faEye} color="#697588" />
          </button>
          <button
            onClick={() => navigateToWorks(estate)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faTrowelBricks} color="#697588" />
          </button>
          <button
            onClick={() => navigateToReports(estate)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
          >
            <FontAwesomeIcon icon={faCamera} color="#697588" />
          </button>
          <button
            onClick={() => navigateToRent(estate)}
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

  function navigateToProperty(estate) {
    navigate("/abm-estate", { state: { estate, editMode: true } });
  }

  function navigateToWorks(estate) {
    navigate("/jobs", { state: { estate } });
  }

  function navigateToReports(estate) {
    navigate("/reportMenu", { state: { estate } });
  }

  function navigateToRent(estate) {
    navigate("/rentMenu", { state: { estate } });
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
            Panel de propiedades
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
                    <th>Dirección</th>
                    <th>Inquilino</th>
                    <th>Alquiler $</th>
                    <th>Comentarios</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>{renderEstateRows()}</tbody>
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

export default EstateMenu;
