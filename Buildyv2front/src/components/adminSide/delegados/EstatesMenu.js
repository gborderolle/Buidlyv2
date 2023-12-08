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
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import useBumpEffect from "../../../utils/useBumpEffect";
import { batch, useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import { fetchEstates } from "../../../store/generalData-actions";
import "./EstatesMenu.css";

const EstatesMenu = () => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [pageCount, setPageCount] = useState(0);

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  const filteredEstateList = estateList.filter((estate) => {
    // Asumiendo que las propiedades tienen nombre, dirección y estado
    const nameMatch = estate.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const addressMatch = estate.address
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const rentedMatch = estate.rented
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || addressMatch || rentedMatch;
  });

  useEffect(() => {
    setPageCount(Math.ceil(filteredEstateList.length / itemsPerPage));
  }, [filteredEstateList]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const bumpHandler = () => {
    triggerBump();
    dispatch(fetchEstates());
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
        <td>{estate.rented ? "Sí" : "No"}</td>
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
            Panel de Propiedades
            <CFormInput
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ maxWidth: "300px" }}
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
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Alquilada</th>
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

export default EstatesMenu;
