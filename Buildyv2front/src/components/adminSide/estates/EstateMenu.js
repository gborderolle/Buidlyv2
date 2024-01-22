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
  faImages,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

import useBumpEffect from "../../../utils/useBumpEffect";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../../store/auth-slice";
import { fetchEstateList } from "../../../store/generalData-actions";

import "./EstateMenu.css";

const EstateMenu = () => {
  //#region Consts ***********************************

  const [isBumped, triggerBump] = useBumpEffect();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstate, setSelectedEstate] = useState(null);

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);

  const [estateList, setEstateList] = useState([]);
  const reduxEstateList =
    useSelector((state) => state.generalData.estateList) || [];

  useEffect(() => {
    setEstateList(reduxEstateList);
  }, [reduxEstateList]);

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

  const handleSelectEstate = (estate) => {
    setSelectedEstate(estate);
    console.log("Estate seleccionado:", estate);
  };

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  const filteredEstateList = estateList.filter((estate) => {
    const match1 = estate.name
      ? estate.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const match2 = estate.address
      ? estate.address.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    // Último alquiler y primer inquilino
    const lastRent =
      estate.listRents && estate.listRents.length > 0
        ? estate.listRents[estate.listRents.length - 1]
        : null;
    const tenantName =
      lastRent && lastRent.listTenants && lastRent.listTenants.length > 0
        ? lastRent.listTenants[0].name
        : null;

    // Verificar si el nombre del inquilino coincide con el término de búsqueda
    const match3 = tenantName
      ? tenantName.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    const match4 =
      lastRent && lastRent.monthlyValue
        ? lastRent.monthlyValue
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false;

    const match5 = estate.comments
      ? estate.comments.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    return match1 || match2 || match3 || match4 || match5;
  });

  useEffect(() => {
    setPageCount(Math.ceil(filteredEstateList.length / itemsPerPage));
  }, [filteredEstateList, itemsPerPage]);

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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Aplicar el ordenamiento a los datos
  const sortedList = useMemo(() => {
    let sortableList = [...filteredEstateList];
    if (sortConfig.key !== null) {
      sortableList.sort((a, b) => {
        // Propiedades anidadas
        if (sortConfig.key === "monthlyValue") {
          const lastRentA =
            a.listRents?.[a.listRents.length - 1]?.monthlyValue || 0;
          const lastRentB =
            b.listRents?.[b.listRents.length - 1]?.monthlyValue || 0;

          if (lastRentA < lastRentB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (lastRentA > lastRentB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        } else if (sortConfig.key === "tenant") {
          // Obtiene el nombre del primer inquilino del último alquiler
          const tenantNameA =
            a.listRents?.[a.listRents.length - 1]?.listTenants?.[0]?.name || "";
          const tenantNameB =
            b.listRents?.[b.listRents.length - 1]?.listTenants?.[0]?.name || "";

          if (tenantNameA.toLowerCase() < tenantNameB.toLowerCase()) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (tenantNameA.toLowerCase() > tenantNameB.toLowerCase()) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        } else {
          // Ordenamiento para las demás propiedades
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableList;
  }, [filteredEstateList, sortConfig]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const renderEstateRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEstates = sortedList.slice(indexOfFirstItem, indexOfLastItem);

    return currentEstates.map((estate, index) => (
      <tr key={estate.id}>
        <td
          style={estate.id === selectedEstate?.id ? { color: "blue" } : null}
          onClick={() => handleSelectEstate(estate)}
        >
          {" "}
          <button
            style={{
              border: "none",
              background: "none",
              padding: 0,
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => handleSelectEstate(estate)}
          >
            {index + 1}
          </button>
        </td>
        <td
          style={estate.id === selectedEstate?.id ? { color: "blue" } : null}
          onClick={() => handleSelectEstate(estate)}
        >
          {estate.name}
        </td>
        <td
          style={estate.id === selectedEstate?.id ? { color: "blue" } : null}
          onClick={() => handleSelectEstate(estate)}
        >
          {estate.address}
        </td>
        <td
          style={estate.id === selectedEstate?.id ? { color: "blue" } : null}
          onClick={() => handleSelectEstate(estate)}
        >
          {estate.listRents &&
          estate.listRents.length > 0 &&
          estate.listRents[estate.listRents.length - 1].listTenants &&
          estate.listRents[estate.listRents.length - 1].listTenants.length > 0
            ? estate.listRents[estate.listRents.length - 1].listTenants[0].name
            : ""}
        </td>
        <td
          style={estate.id === selectedEstate?.id ? { color: "blue" } : null}
          onClick={() => handleSelectEstate(estate)}
        >
          {estate.presentRentId > 0 && estate.listRents.length > 0
            ? formatToDollars(
                estate.listRents?.[estate.listRents.length - 1].monthlyValue
              )
            : "$0"}
        </td>
        <td
          style={estate.id === selectedEstate?.id ? { color: "blue" } : null}
          onClick={() => handleSelectEstate(estate)}
        >
          {estate.comments}
        </td>
        <td style={estate.id === selectedEstate?.id ? { color: "blue" } : null}>
          <button
            onClick={() => navigateToEstate(estate)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
            title="Ver propiedad"
          >
            <FontAwesomeIcon icon={faEye} color="#697588" />
          </button>
          <button
            onClick={() => navigateToJobs(estate)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
            title="Ver obras"
          >
            <FontAwesomeIcon
              icon={faTrowelBricks}
              color={
                estate.listJobs && estate.listJobs.length > 0
                  ? "#697588"
                  : "lightgray"
              }
            />
          </button>
          <button
            onClick={() => navigateToReports(estate)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
            title="Ver reportes"
          >
            <FontAwesomeIcon
              icon={faImages}
              color={
                estate.listReports && estate.listReports.length > 0
                  ? "#697588"
                  : "lightgray"
              }
            />
          </button>
          <button
            onClick={() => navigateToRent(estate)}
            style={{ border: "none", background: "none" }}
            className={isBumped ? "bump" : ""}
            title={
              estate.presentRentId > 0 ? "Ver alquiler" : "Agregar alquiler"
            }
          >
            <FontAwesomeIcon
              icon={faDollarSign}
              color={estate.presentRentId > 0 ? "#697588" : "lightgray"}
            />
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

  function navigateToEstate(estate) {
    navigate("/abm-estate", { state: { estate, editMode: true } });
  }

  function navigateToJobs(estate) {
    navigate("/jobs", { state: { estate, listMode: true } });
  }

  function navigateToReports(estate) {
    navigate("/reports", { state: { estate, listMode: true } });
  }

  function navigateToRent(estate) {
    if (estate.presentRentId > 0) {
      navigate("/abm-rent", { state: { estate, editMode: true } });
    } else {
      navigate("/abm-rent", { state: { estate } });
    }
  }

  const formatToDollars = (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
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
                    <th
                      className="table-header"
                      onClick={() => requestSort("name")}
                    >
                      Nombre
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("address")}
                    >
                      Dirección
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("tenant")}
                    >
                      Inquilino
                    </th>
                    <th
                      className="table-header"
                      onClick={() => requestSort("monthlyValue")}
                    >
                      Renta $
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
