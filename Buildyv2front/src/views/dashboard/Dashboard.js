import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CProgress,
  CListGroup,
  CListGroupItem,
  CInputGroup,
  CFormInput,
  CPagination,
  CPaginationItem,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from "@coreui/react";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { CChartPie } from "@coreui/react-chartjs";

import useBumpEffect from "../../utils/useBumpEffect";

// redux imports
import { batch, useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";
import {
  fetchPartyList,
  fetchProvinceList,
  fetchMunicipalityList,
  fetchCircuitList,
  fetchSlateList,
  fetchCandidateList,
} from "../../store/generalData-actions";

import "./Dashboard.css";
import classesMobile from "./DashboardMobile.module.css";

import styled from "styled-components";
const StyledProgress = styled(CProgress)`
  .c-progress-bar {
    background-color: ${(props) => props.bgColor} !important;
  }
`;

const Dashboard = () => {
  //#region Consts ***********************************

  const [totalSlateVotes, setTotalSlateVotes] = useState(0);
  const [totalPartyVotes, setTotalPartyVotes] = useState(0);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedCircuit, setSelectedCircuit] = useState(null);

  const [partyChartData, setPartyChartData] = useState({
    datasets: [],
    labels: [],
  });
  const [slateChartData, setSlateChartData] = useState({
    datasets: [],
    labels: [],
  });

  const [searchProvince, setSearchProvince] = useState("");
  const [searchMunicipality, setSearchMunicipality] = useState("");
  const [searchCircuit, setSearchCircuit] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Ajusta este número según tus necesidades
  const [pageCount, setPageCount] = useState(0);

  const [isBumped, triggerBump] = useBumpEffect();

  const [filteredPartyVotes, setFilteredPartyVotes] = useState([]);
  const [filteredSlateVotes, setFilteredSlateVotes] = useState([]);
  const [filteredProvinceList, setFilteredProvinceList] = useState([]);

  const [activeKey, setActiveKey] = useState(1);
  const isMobile = JSON.parse(localStorage.getItem("isMobile"));

  // redux
  const dispatch = useDispatch();

  //#region RUTA PROTEGIDA
  const navigate = useNavigate();
  const userRoleNumber = useSelector((state) => state.auth.userRoleNumber);
  useEffect(() => {
    const USER_ROLE_ID = 1;
    if (userRoleNumber != USER_ROLE_ID) {
      dispatch(authActions.logout());
      navigate("/login-general");
    }
  }, [userRoleNumber, navigate, dispatch]);
  //#endregion RUTA PROTEGIDA

  // redux gets
  const myPartyName = useSelector((state) => state.loggedUser.myPartyName);
  const myPartyColor = useSelector((state) => state.loggedUser.myPartyColor);

  const [partyList, setPartyList] = useState([]);
  const reduxPartyList = useSelector((state) => state.generalData.partyList);

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

  const [slateList, setSlateList] = useState([]);
  const reduxSlateList = useSelector((state) => state.generalData.slateList);
  const [sortedSlateList, setSortedSlateList] = useState([]);
  const [slateColors, setSlateColors] = useState({});

  const dropdownVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5, type: "spring", stiffness: 120 },
    },
    closed: { opacity: 0, height: 0, transition: { duration: 0.5 } },
  };

  // Filtrar municipios y circuitos basados en las selecciones
  const filteredMunicipalityList = selectedProvince
    ? reduxMunicipalityList.filter(
        (municipality) =>
          municipality.provinceId === selectedProvince.provinceId &&
          municipality.municipalityName
            .toLowerCase()
            .includes(searchMunicipality.toLowerCase())
      )
    : [];

  const filteredCircuitList = selectedMunicipality
    ? reduxCircuitList.filter(
        (circuit) =>
          circuit.municipalityId === selectedMunicipality.municipalityId &&
          circuit.step1completed &&
          circuit.step2completed &&
          circuit.step3completed &&
          (circuit.circuitName
            .toLowerCase()
            .includes(searchCircuit.toLowerCase()) ||
            circuit.circuitNumber.toString().includes(searchCircuit))
      )
    : [];

  const calculateTotalSlateVotes = () => {
    let totalVotes = 0;

    if (selectedCircuit) {
      totalVotes = selectedCircuit.slateVotesList.reduce(
        (sum, slate) => sum + slate.votes,
        0
      );
    } else if (selectedMunicipality) {
      // Caso en que hay un municipio seleccionado
      const circuitsInMunicipality = circuitList.filter(
        (circuit) =>
          circuit.municipalityId === selectedMunicipality.municipalityId
      );
      circuitsInMunicipality.forEach((circuit) => {
        totalVotes += circuit.slateVotesList.reduce(
          (sum, slate) => sum + slate.votes,
          0
        );
      });
    } else if (selectedProvince) {
      // Caso en que hay una provincia seleccionada
      // Obtener los IDs de los municipios que pertenecen a la provincia seleccionada
      const municipalityIdsInProvince = municipalityList
        .filter(
          (municipality) =>
            municipality.provinceId === selectedProvince.provinceId
        )
        .map((municipality) => municipality.municipalityId);

      // Filtrar circuitList para obtener los circuitos que pertenecen a estos municipios
      const circuitsInProvince = circuitList.filter((circuit) =>
        municipalityIdsInProvince.includes(circuit.municipalityId)
      );

      // Sumar los votos de todos los slates en estos circuitos
      circuitsInProvince.forEach((circuit) => {
        totalVotes += circuit.slateVotesList.reduce(
          (sum, slate) => sum + slate.votes,
          0
        );
      });
    } else {
      // Caso en que no hay nada seleccionado
      circuitList.forEach((circuit) => {
        totalVotes += circuit.slateVotesList.reduce(
          (sum, slate) => sum + slate.votes,
          0
        );
      });
    }

    return totalVotes;
  };

  const calculateTotalPartyVotes = () => {
    let totalVotes = 0;
    filteredPartyVotes.forEach((party) => {
      totalVotes += party.votes;
    });
    return totalVotes;
  };

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    setActiveKey(isMobile ? null : 1); // Ajusta el '1' al key del acordeón que quieres abierto por defecto en modo no móvil
  }, [isMobile]);

  useEffect(() => {
    setPageCount(Math.ceil(filteredCircuitList.length / itemsPerPage));
  }, [filteredCircuitList]);

  useEffect(() => {
    calculatePartyChartData();
    sortSlateList();
  }, [
    selectedProvince,
    selectedMunicipality,
    selectedCircuit,
    circuitList,
    municipalityList,
    myPartyName,
    totalSlateVotes,
  ]);

  function sortSlateList() {
    if (selectedCircuit && selectedCircuit.slateVotesList) {
      const sortedList = [...selectedCircuit.slateVotesList].sort(
        (a, b) => b.votes - a.votes
      );
      setSortedSlateList(sortedList);
    }
  }

  useEffect(() => {
    const filtered = provinceList.filter((province) =>
      province.provinceName.toLowerCase().includes(searchProvince.toLowerCase())
    );
    setFilteredProvinceList(filtered);
  }, [searchProvince, provinceList]);

  useEffect(() => {
    const totalVotes = calculateTotalSlateVotes();
    setTotalSlateVotes(totalVotes);

    calculatePartyChartData();
    sortSlateList();
    setSlateChartData(calculateSlateChartData()); // Actualizar los datos de la gráfica de las listas
  }, [selectedProvince, selectedMunicipality, selectedCircuit, circuitList]);

  // Genera un color aleatorio para cada lista cuando la lista de slates cambie
  useEffect(() => {
    const newSlateColors = reduxSlateList.reduce((colors, slate) => {
      colors[slate.slateId] = slate.slateColor || getRandomColor();
      return colors;
    }, {});

    setSlateColors(newSlateColors);
  }, [reduxSlateList]);

  useEffect(() => {
    // Asegúrate de que reduxSelectedCircuit y slateVotesList existen
    if (selectedCircuit && selectedCircuit.slateVotesList) {
      selectedCircuit.slateVotesList.forEach((slate, index) => {
        const slateColor = slateColors[slate.slateId] || getRandomColor();
        const element = document.getElementById(`idSlate-${index}`);
        if (element) {
          element.style.borderLeft = `4px solid ${slateColor} !important`;
        }
      });
    }
  }, [selectedCircuit, slateColors]);

  // redux gets
  useEffect(() => {
    setPartyList(reduxPartyList);
    setProvinceList(reduxProvinceList);
    setMunicipalityList(reduxMunicipalityList);
    setCircuitList(reduxCircuitList);
    setSlateList(reduxSlateList);
  }, [
    reduxPartyList,
    reduxProvinceList,
    reduxMunicipalityList,
    reduxCircuitList,
    reduxSlateList,
  ]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  // Utilidad para el cálculo del porcentaje.
  const calculatePercentage = (partialValue, totalValue) => {
    if (totalValue === 0) {
      return 0; // O cualquier valor que consideres apropiado para divisiones por cero
    }
    return Math.round((partialValue / totalValue) * 100);
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
  const currentCircuits = filteredCircuitList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Función modificada para renderizar los circuitos de la página actual
  const renderCircuitList = () => {
    if (currentCircuits && currentCircuits.length > 0) {
      return currentCircuits.map((circuit) => {
        const totalVotes = getTotalVotesByCircuit(circuit.circuitId);
        return (
          <CListGroupItem
            component="button"
            key={circuit.circuitId}
            onClick={() => handleCircuitClick(circuit)}
            className={
              selectedCircuit && selectedCircuit.circuitId === circuit.circuitId
                ? "selected-item"
                : ""
            }
          >
            {`#${circuit.circuitNumber}: ${circuit.circuitName} (${totalVotes} votos)`}
          </CListGroupItem>
        );
      });
    }
  };

  const sumPartyVotes = (circuits) => {
    const totalVotesByParty = {};

    circuits.forEach((circuit) => {
      if (circuit.partyVotesList) {
        circuit.partyVotesList.forEach((partyVote) => {
          // Buscar el color del partido si no está presente en partyVote
          const partyColor =
            partyVote.partyColor || getPartyById(partyVote.partyId).partyColor;

          if (totalVotesByParty[partyVote.partyId]) {
            totalVotesByParty[partyVote.partyId].votes += partyVote.votes;
          } else {
            totalVotesByParty[partyVote.partyId] = {
              ...partyVote,
              votes: partyVote.votes,
              partyColor: partyColor, // Agregar el color del partido
            };
          }
        });
      }
    });

    return Object.values(totalVotesByParty);
  };

  const sumSlateVotes = (circuits) => {
    const totalVotesBySlate = {};

    circuits.forEach((circuit) => {
      if (circuit.slateVotesList) {
        circuit.slateVotesList.forEach((slateVote) => {
          const slateColor = slateVote.slateColor || getRandomColor();

          if (totalVotesBySlate[slateVote.slateId]) {
            totalVotesBySlate[slateVote.slateId].votes += slateVote.votes;
          } else {
            totalVotesBySlate[slateVote.slateId] = {
              ...slateVote,
              votes: slateVote.votes,
              slateColor: slateColor,
            };
          }
        });
      }
    });

    return Object.values(totalVotesBySlate);
  };

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function hexToRGBA(hex, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const getPartyById = (partyId) => {
    const party = reduxPartyList.find((p) => p.partyId === partyId);
    return (
      party || {
        partyName: myPartyName ? myPartyName : "N/A",
        partyColor: myPartyColor ? myPartyColor : getRandomColor(),
      }
    );
  };

  const getSlateNameById = (slateId) => {
    const slate = reduxSlateList.find((s) => s.slateId === slateId);
    return slate ? slate.slateName : "N/A";
  };

  const updatePartyChartData = () => {
    const newChartData = {
      labels: filteredPartyVotes.map(
        (vote) => `${vote.partyName} (${vote.votes})`
      ),
      datasets: [
        {
          data: filteredPartyVotes.map((vote) => vote.votes),
          backgroundColor: filteredPartyVotes.map(
            (vote) => vote.partyColor || getRandomColor()
          ),
          hoverBackgroundColor: filteredPartyVotes.map((vote) =>
            vote.partyColor
              ? hexToRGBA(vote.partyColor, 0.9)
              : hexToRGBA(getRandomColor(), 0.9)
          ),
        },
      ],
    };

    setPartyChartData(newChartData);
  };

  const calculatePartyChartData = () => {
    let filteredPartyVotes1 = []; // Valor predeterminado como un arreglo vacío

    if (selectedCircuit) {
      filteredPartyVotes1 = circuitList.find(
        (circuit) => circuit.circuitId === selectedCircuit.circuitId
      )?.partyVotesList;
    } else if (selectedMunicipality) {
      const circuitsInMunicipality = circuitList.filter(
        (circuit) =>
          circuit.municipalityId === selectedMunicipality.municipalityId
      );
      filteredPartyVotes1 = sumPartyVotes(circuitsInMunicipality);
    } else if (selectedProvince) {
      const municipalitiesInProvince = municipalityList.filter(
        (municipality) =>
          municipality.provinceId === selectedProvince.provinceId
      );
      const circuitsInProvince = circuitList.filter((circuit) =>
        municipalitiesInProvince.some(
          (municipality) =>
            municipality.municipalityId === circuit.municipalityId
        )
      );
      filteredPartyVotes1 = sumPartyVotes(circuitsInProvince);
    } else {
      filteredPartyVotes1 = sumPartyVotes(circuitList);
    }

    // Actualizar el estado de los datos del gráfico
    if (filteredPartyVotes1) {
      setFilteredPartyVotes(filteredPartyVotes1);
      updatePartyChartData();
      setTotalPartyVotes(calculateTotalPartyVotes());
    }
  };

  const calculateSlateChartData = () => {
    let filteredSlateVotes1 = [];

    // Aplica el filtrado según la selección actual (circuito, municipio, provincia)
    if (selectedCircuit) {
      filteredSlateVotes1 = circuitList.find(
        (circuit) => circuit.circuitId === selectedCircuit.circuitId
      )?.slateVotesList;
    } else if (selectedMunicipality) {
      const circuitsInMunicipality = circuitList.filter(
        (circuit) =>
          circuit.municipalityId === selectedMunicipality.municipalityId
      );
      filteredSlateVotes1 = sumSlateVotes(circuitsInMunicipality);
    } else if (selectedProvince) {
      const municipalitiesInProvince = municipalityList.filter(
        (municipality) =>
          municipality.provinceId === selectedProvince.provinceId
      );
      const circuitsInProvince = circuitList.filter((circuit) =>
        municipalitiesInProvince.some(
          (municipality) =>
            municipality.municipalityId === circuit.municipalityId
        )
      );
      filteredSlateVotes1 = sumSlateVotes(circuitsInProvince);
    } else {
      filteredSlateVotes1 = sumSlateVotes(circuitList);
    }

    // Prepara los datos para el gráfico
    const slateChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
        },
      ],
    };

    // Suma y prepara los datos de las listas para el gráfico
    filteredSlateVotes1.forEach((slate) => {
      slateChartData.labels.push(`${slate.slateName} (${slate.votes})`);
      slateChartData.datasets[0].data.push(slate.votes);
      slateChartData.datasets[0].backgroundColor.push(
        slate.slateColor || getRandomColor()
      );
      slateChartData.datasets[0].hoverBackgroundColor.push(
        hexToRGBA(slate.slateColor || getRandomColor(), 0.9)
      );
    });

    // Actualizar el estado de los datos del gráfico
    if (filteredSlateVotes1) {
      setFilteredSlateVotes(filteredSlateVotes1);
    }

    return slateChartData;
  };

  const getTotalVotesByProvince = (provinceId) => {
    const municipalitiesInProvince = reduxMunicipalityList.filter(
      (municipality) => municipality.provinceId === provinceId
    );

    let totalVotes = 0;
    municipalitiesInProvince.forEach((municipality) => {
      const circuitsInMunicipality = reduxCircuitList.filter(
        (circuit) => circuit.municipalityId === municipality.municipalityId
      );

      circuitsInMunicipality.forEach((circuit) => {
        if (circuit.partyVotesList) {
          totalVotes += circuit.partyVotesList.reduce(
            (sum, partyVote) => sum + partyVote.votes,
            0
          );
        }
      });
    });

    return totalVotes;
  };

  const getTotalVotesAllProvinces = () => {
    let totalVotes = 0;
    reduxProvinceList.forEach((province) => {
      totalVotes += getTotalVotesByProvince(province.provinceId);
    });
    return totalVotes;
  };

  const getTotalVotesAllMunicipalities = () => {
    let totalVotes = 0;

    if (selectedProvince) {
      const municipalityInProvince = reduxMunicipalityList.filter(
        (municipality) =>
          municipality.provinceId === selectedProvince.provinceId
      );

      municipalityInProvince.forEach((municipality) => {
        const circuitsInMunicipality = reduxCircuitList.filter(
          (circuit) => circuit.municipalityId === municipality.municipalityId
        );

        circuitsInMunicipality.forEach((circuit) => {
          if (circuit.partyVotesList) {
            totalVotes += circuit.partyVotesList.reduce(
              (sum, partyVote) => sum + partyVote.votes,
              0
            );
          }
        });
      });
    }
    return totalVotes;
  };

  const getTotalVotesAllCircuits = () => {
    let totalVotes = 0;

    if (selectedMunicipality) {
      const circuitsInMunicipality = reduxCircuitList.filter(
        (circuit) =>
          circuit.municipalityId === selectedMunicipality.municipalityId
      );

      circuitsInMunicipality.forEach((circuit) => {
        if (circuit.partyVotesList) {
          totalVotes += circuit.partyVotesList.reduce(
            (sum, partyVote) => sum + partyVote.votes,
            0
          );
        }
      });
    }
    return totalVotes;
  };

  const getTotalVotesByMunicipality = (municipalityId) => {
    const circuitsInMunicipality = reduxCircuitList.filter(
      (circuit) => circuit.municipalityId === municipalityId
    );

    let totalVotes = 0;
    circuitsInMunicipality.forEach((circuit) => {
      if (circuit.partyVotesList) {
        totalVotes += circuit.partyVotesList.reduce(
          (sum, partyVote) => sum + partyVote.votes,
          0
        );
      }
    });

    return totalVotes;
  };

  const getTotalVotesByCircuit = (circuitId) => {
    const circuit = reduxCircuitList.find((c) => c.circuitId === circuitId);

    if (!circuit || !circuit.partyVotesList) {
      return 0;
    }

    return circuit.partyVotesList.reduce(
      (sum, partyVote) => sum + partyVote.votes,
      0
    );
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProvinceClick = (province) => {
    setSelectedProvince(province);
    setSelectedMunicipality(null); // Resetea la selección de municipio
  };

  // Manejador para cuando se selecciona un municipio
  const handleMunicipalityClick = (municipality) => {
    setSelectedMunicipality(municipality);
    setSelectedCircuit(null); // Resetea la selección de municipio
  };

  const handleCircuitClick = (circuit) => {
    setSelectedCircuit(circuit);
  };

  const bumpHandler = () => {
    triggerBump();

    const fetchGeneralData = async () => {
      batch(() => {
        dispatch(fetchPartyList());
        dispatch(fetchProvinceList());
        dispatch(fetchMunicipalityList());
        dispatch(fetchCircuitList());
        dispatch(fetchSlateList());
        dispatch(fetchCandidateList());
      });
    };
    fetchGeneralData();
    calculatePartyChartData();
  };

  //#endregion Events ***********************************

  //#region JSX ***********************************

  const addStyle = (styleString) => {
    const style = document.createElement("style");
    style.textContent = styleString;
    document.head.append(style);
  };

  const getDynamicClassName = (color) => {
    const className = `progress-bar-${color.replace("#", "")}`;
    addStyle(`.${className} { background-color: ${color}; }`);
    return className;
  };

  const setDynamicBorderStyle = (color, index, element) => {
    const colorCode = color.replace("#", "");
    // addStyle(`#idLista-${index} { border-color: #${colorCode} !important; }`);
    addStyle(
      `#${element}-${index} { border-color: #${colorCode} !important; }`
    );
  };

  // Actualizar las funciones de renderizado para incorporar el manejo de clics
  const renderProvinceList = () => {
    if (filteredProvinceList && filteredProvinceList.length > 0) {
      return filteredProvinceList.map((province) => {
        const totalVotes = getTotalVotesByProvince(province.provinceId);
        return (
          <CListGroupItem
            component="button"
            key={province.provinceId}
            onClick={() => handleProvinceClick(province)}
            className={
              selectedProvince &&
              selectedProvince.provinceId === province.provinceId
                ? "selected-item"
                : ""
            }
          >
            {`${province.provinceName} (${totalVotes} votos)`}
          </CListGroupItem>
        );
      });
    }
  };

  const renderMunicipalityList = () => {
    if (filteredMunicipalityList && filteredMunicipalityList.length > 0) {
      return filteredMunicipalityList.map((municipality) => {
        const totalVotes = getTotalVotesByMunicipality(
          municipality.municipalityId
        );
        return (
          <CListGroupItem
            component="button"
            key={municipality.municipalityId}
            onClick={() => handleMunicipalityClick(municipality)}
            className={
              selectedMunicipality &&
              selectedMunicipality.municipalityId ===
                municipality.municipalityId
                ? "selected-item"
                : ""
            }
          >
            {`${municipality.municipalityName} (${totalVotes} votos)`}
          </CListGroupItem>
        );
      });
    }
  };

  const totalVotes = partyChartData.datasets.reduce(
    (total, dataset) =>
      total + dataset.data.reduce((sum, value) => sum + value, 0),
    0
  );

  const filterVariants = {
    hidden: {
      y: -20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  //#endregion JSX ***********************************

  return (
    <>
      <motion.div initial="closed" animate="open" variants={dropdownVariants}>
        <CCard className="mb-4" style={{ paddingBottom: "4rem" }}>
          <CCardHeader>
            Panel general
            <button
              onClick={bumpHandler}
              style={{ border: "none", background: "none", float: "right" }}
              className={isBumped ? "bump" : ""}
            >
              <FontAwesomeIcon icon={faRefresh} color="#697588" />{" "}
            </button>
          </CCardHeader>
          <CCardBody>
            <CRow className="justify-content-center">
              {/*  */}
              <CCol xs={12} sm={6} md={6} lg={4} xl={4}>
                <CAccordion activeItemKey={activeKey}>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={filterVariants}
                  >
                    <CAccordionItem itemKey={1}>
                      <CAccordionHeader className="custom-accordion-header">
                        Filtros
                      </CAccordionHeader>
                      <CAccordionBody>
                        <CListGroup>
                          <CInputGroup>
                            <CFormInput
                              placeholder="Filtrar departamento..."
                              onChange={(e) =>
                                setSearchProvince(e.target.value)
                              }
                              size="sm"
                            />
                          </CInputGroup>
                          <CListGroupItem active>
                            Departamentos ({getTotalVotesAllProvinces()} votos)
                          </CListGroupItem>
                          {renderProvinceList()}{" "}
                        </CListGroup>
                        <br />
                        <CListGroup>
                          <CInputGroup>
                            <CFormInput
                              placeholder="Filtrar municipio..."
                              onChange={(e) =>
                                setSearchMunicipality(e.target.value)
                              }
                              size="sm"
                            />
                          </CInputGroup>
                          <CListGroupItem active>
                            Municipios ({getTotalVotesAllMunicipalities()}{" "}
                            votos)
                          </CListGroupItem>
                          {renderMunicipalityList()}{" "}
                        </CListGroup>
                        <br />
                        <CListGroup>
                          <CInputGroup>
                            <CFormInput
                              placeholder="Filtrar circuito..."
                              onChange={(e) => setSearchCircuit(e.target.value)}
                              size="sm"
                            />
                          </CInputGroup>
                          <CListGroupItem active>
                            Circuitos cerrados ({getTotalVotesAllCircuits()}{" "}
                            votos)
                          </CListGroupItem>
                          {renderCircuitList()} <br />
                          <CPagination
                            align="center"
                            aria-label="Page navigation example"
                          >
                            {startPage > 1 && (
                              <CPaginationItem
                                onClick={() => handlePageChange(1)}
                              >
                                1
                              </CPaginationItem>
                            )}
                            {startPage > 2 && (
                              <CPaginationItem>...</CPaginationItem>
                            )}
                            {[...Array(endPage - startPage + 1)].map(
                              (_, index) => (
                                <CPaginationItem
                                  key={startPage + index}
                                  active={startPage + index === currentPage}
                                  onClick={() =>
                                    handlePageChange(startPage + index)
                                  }
                                >
                                  {startPage + index}
                                </CPaginationItem>
                              )
                            )}
                            {endPage < pageCount - 1 && (
                              <CPaginationItem>...</CPaginationItem>
                            )}
                            {endPage < pageCount && (
                              <CPaginationItem
                                onClick={() => handlePageChange(pageCount)}
                              >
                                {pageCount}
                              </CPaginationItem>
                            )}
                          </CPagination>
                        </CListGroup>
                      </CAccordionBody>
                    </CAccordionItem>
                  </motion.div>
                </CAccordion>
              </CCol>
              {/*  */}
              {isMobile && "\u00A0"}
              <CCol xs={12} sm={6} md={6} lg={4} xl={4}>
                <CAccordion activeItemKey={1}>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={filterVariants}
                  >
                    <CAccordionItem itemKey={1}>
                      <CAccordionHeader className="custom-accordion-header">
                        Partidos políticos
                      </CAccordionHeader>
                      <CAccordionBody>
                        {filteredPartyVotes ? (
                          <>
                            <CRow>
                              {filteredPartyVotes.map((party, index) => {
                                const votePercentage = calculatePercentage(
                                  party.votes,
                                  totalPartyVotes
                                );
                                const partyColor = getPartyById(
                                  party.partyId
                                ).partyColor;
                                setDynamicBorderStyle(
                                  partyColor,
                                  index,
                                  "idParty"
                                );
                                return (
                                  <CCol xs={6} key={party.partyId}>
                                    <div
                                      id={`idParty-` + index}
                                      className={`border-start border-start-5 py-1 px-3 mb-3`}
                                    >
                                      <div
                                        className={`fs-5 fw-semibold ${classesMobile.label}`}
                                      >
                                        {getPartyById(party.partyId).partyName}
                                      </div>
                                      <div
                                        className={`text-medium-emphasis small ${classesMobile.value}`}
                                      >
                                        {`Votos: ${party.votes} (${votePercentage}%)`}
                                      </div>
                                    </div>
                                  </CCol>
                                );
                              })}
                            </CRow>

                            <hr className="mt-0" />

                            {filteredPartyVotes.map((party) => {
                              const votePercentage = calculatePercentage(
                                party.votes,
                                totalPartyVotes
                              );
                              const partyColor = getPartyById(
                                party.partyId
                              ).partyColor;
                              const progressBarClass =
                                getDynamicClassName(partyColor);

                              return (
                                <div
                                  className="progress-group mb-4"
                                  key={party.partyId}
                                >
                                  <div className="progress-group-header">
                                    <span>
                                      Partido:{" "}
                                      {getPartyById(party.partyId).partyName}
                                    </span>
                                    <span className="ms-auto">{`Votos: ${party.votes} (${votePercentage}%)`}</span>
                                  </div>
                                  <div className="progress-group-bars">
                                    <StyledProgress
                                      value={votePercentage}
                                      progressBarClassName={progressBarClass}
                                      variant="striped"
                                      animated
                                    />
                                  </div>
                                </div>
                              );
                            })}

                            <CAccordion activeItemKey={1}>
                              <CAccordionItem itemKey={1}>
                                <CAccordionHeader className="custom-accordion-header">
                                  Distribución
                                </CAccordionHeader>
                                <CAccordionBody>
                                  {partyChartData && totalVotes > 0 ? (
                                    <CChartPie data={partyChartData} />
                                  ) : (
                                    <span
                                      style={{
                                        color: "blue",
                                        fontStyle: "italic",
                                      }}
                                    >
                                      No hay votos aún.
                                    </span>
                                  )}
                                </CAccordionBody>
                              </CAccordionItem>
                            </CAccordion>
                          </>
                        ) : (
                          <span style={{ color: "blue", fontStyle: "italic" }}>
                            No hay votos aún.
                          </span>
                        )}
                      </CAccordionBody>
                    </CAccordionItem>
                  </motion.div>
                </CAccordion>
              </CCol>
              {/*  */}
              {isMobile && "\u00A0"}
              <CCol xs={12} sm={6} md={6} lg={4} xl={4}>
                <CAccordion activeItemKey={1}>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={filterVariants}
                  >
                    <CAccordionItem itemKey={1}>
                      <CAccordionHeader className="custom-accordion-header">
                        Listas del partido
                      </CAccordionHeader>
                      <CAccordionBody>
                        {filteredSlateVotes ? (
                          <>
                            <CRow>
                              {filteredSlateVotes.map((slate, index) => {
                                const votePercentage = calculatePercentage(
                                  slate.votes,
                                  totalSlateVotes
                                );
                                const slateColor =
                                  slateColors[slate.slateId] ||
                                  getRandomColor();
                                setDynamicBorderStyle(
                                  slateColor,
                                  index,
                                  "idSlate"
                                );
                                return (
                                  <CCol xs={6} key={slate.slateId}>
                                    <div
                                      id={`idSlate-` + index}
                                      className={`border-start border-start-5 py-1 px-3 mb-3`}
                                    >
                                      <div
                                        className={`fs-5 fw-semibold ${classesMobile.label}`}
                                      >
                                        {getSlateNameById(slate.slateId)}
                                      </div>
                                      <div
                                        className={`text-medium-emphasis small ${classesMobile.value}`}
                                      >
                                        {`Votos: ${slate.votes} (${votePercentage}%)`}
                                      </div>
                                    </div>
                                  </CCol>
                                );
                              })}
                            </CRow>

                            <hr className="mt-0" />

                            {filteredSlateVotes.map((slate) => {
                              const votePercentage = calculatePercentage(
                                slate.votes,
                                totalSlateVotes
                              );
                              const slateColor =
                                slateColors[slate.slateId] || getRandomColor();
                              const progressBarClass =
                                getDynamicClassName(slateColor);

                              return (
                                <div
                                  className="progress-group mb-4"
                                  key={slate.slateId}
                                >
                                  <div className="progress-group-header">
                                    <span>
                                      Lista: {getSlateNameById(slate.slateId)}
                                    </span>
                                    <span className="ms-auto">{`Votos: ${slate.votes} (${votePercentage}%)`}</span>
                                  </div>
                                  <div className="progress-group-bars">
                                    <StyledProgress
                                      value={votePercentage}
                                      progressBarClassName={progressBarClass}
                                      variant="striped"
                                      animated
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <span style={{ color: "blue", fontStyle: "italic" }}>
                            No hay votos aún.
                          </span>
                        )}

                        <CAccordion activeItemKey={1}>
                          <CAccordionItem itemKey={1}>
                            <CAccordionHeader className="custom-accordion-header">
                              Distribución
                            </CAccordionHeader>
                            <CAccordionBody>
                              {slateChartData &&
                              slateChartData.datasets[0] &&
                              slateChartData.datasets[0].data.length > 0 &&
                              totalVotes > 0 ? (
                                <CChartPie data={slateChartData} />
                              ) : (
                                <span
                                  style={{
                                    color: "blue",
                                    fontStyle: "italic",
                                  }}
                                >
                                  No hay votos aún.
                                </span>
                              )}
                            </CAccordionBody>
                          </CAccordionItem>
                        </CAccordion>
                      </CAccordionBody>
                    </CAccordionItem>
                  </motion.div>
                </CAccordion>
              </CCol>
              {/*  */}
            </CRow>
          </CCardBody>
        </CCard>
      </motion.div>
    </>
  );
};

export default Dashboard;
