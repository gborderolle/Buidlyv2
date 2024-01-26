import React, { useState, useEffect, useMemo } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
} from "@coreui/react";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import { fetchLogsList } from "../../../store/generalData-actions";

import "./LogsTable.css";

const LogsTable = () => {
  //#region Consts ***********************************

  const [logs, setLogs] = useState([]); // Esto debería ser reemplazado por tu lógica de obtención de datos
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [pageCount, setPageCount] = useState(0); // Añade esto

  // redux
  const dispatch = useDispatch();

  // Redux
  const logsList = useSelector((state) => state.generalData.logsList);

  const [sortConfig, setSortConfig] = useState({
    key: "creation",
    direction: "descending",
  });

  useEffect(() => {
    dispatch(fetchLogsList());
  }, [dispatch]);

  useEffect(() => {
    setPageCount(Math.ceil(logs.length / itemsPerPage));
  }, [logsList, itemsPerPage]);

  // Función para verificar si la fecha del log es la actual
  const isToday = (logDate) => {
    const today = new Date();
    const logCreationDate = new Date(logDate);
    return logCreationDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  const sortedList = useMemo(() => {
    let sortableList = [...logsList];
    if (sortConfig.key !== null) {
      sortableList.sort((a, b) => {
        // Ordenamiento estándar para otras propiedades
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
  }, [logsList, sortConfig]);

  const indexOfLastLog = currentPage * itemsPerPage;
  const indexOfFirstLog = indexOfLastLog - itemsPerPage;
  const currentLogs = sortedList.slice(indexOfFirstLog, indexOfLastLog);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //#endregion Events ***********************************

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCities = logsList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <CTable striped>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort("entity")}>
              Entidad
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort("action")}>
              Acción
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort("data")}>
              Datos
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort("username")}>
              Usuario
            </CTableHeaderCell>
            <CTableHeaderCell onClick={() => requestSort("creation")}>
              Creación
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentLogs.map((log, index) => {
            const isLogToday = isToday(log.creation);
            const rowClass = isLogToday ? "log-text-warning" : "";

            return (
              <CTableRow key={log.id}>
                <CTableDataCell className={rowClass}>
                  {indexOfFirstLog + index + 1}
                </CTableDataCell>
                <CTableDataCell className={rowClass}>
                  {log.entity}
                </CTableDataCell>
                <CTableDataCell className={rowClass}>
                  {log.action}
                </CTableDataCell>
                <CTableDataCell className={rowClass}>
                  {log.username}
                </CTableDataCell>
                <CTableDataCell className={rowClass}>{log.data}</CTableDataCell>
                <CTableDataCell className={rowClass}>
                  {new Date(log.creation).toLocaleString()}
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>

      <CPagination align="center">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </CPaginationItem>
        ))}
      </CPagination>
    </div>
  );
};

export default LogsTable;
