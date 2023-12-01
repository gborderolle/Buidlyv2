import { getDatabase, ref, get } from "firebase/database";
import { FirebaseUrls } from "../utils/firebaseSetup";
import { generalDataActions } from "./generalData-slice";
import { formActions } from "./form-slice";

export const fetchPartyList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.partyFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }

      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      // Incluir Push IDs como una propiedad más en cada objeto
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setPartyList(dataArray));
    } catch (error) {}
  };
};

export const fetchProvinceList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.provinceFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }

      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setProvinceList(dataArray));
    } catch (error) {}
  };
};

export const fetchMunicipalityList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.municipalityFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }

      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setMunicipalityList(dataArray));
    } catch (error) {}
  };
};

export const fetchCircuitList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.circuitFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }

      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      // Incluir Push IDs como una propiedad más en cada objeto
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setCircuitList(dataArray));
    } catch (error) {}
  };
};

export const fetchSlateList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.slateFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }
      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setSlateList(dataArray));
    } catch (error) {}
  };
};

export const fetchVotosTotal = (circuit) => {
  if (circuit) {
    return async (dispatch) => {
      const db = getDatabase();
      const fetchFromFirebase = async (path) => {
        const dbRef = ref(db, path);
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : {};
      };

      try {
        const partyList = await fetchFromFirebase("partyList");
        const slateList = await fetchFromFirebase("slateList");
        const circuitList = await fetchFromFirebase(
          "circuitList/" + circuit.pushId
        );

        // Sumar los votos de slates y partidos para el circuito especificado

        // Sumar los votos de partidos y listas para el circuito especificado
        let votosPartyTotal = 0;
        if (circuit && circuit.partyVotesList) {
          circuit.partyVotesList.forEach((party) => {
            // Descarto al partido cliente (votos ya incluidos en slateList)
            if (party.partyId !== 0) {
              votosPartyTotal += party.votes;
            }
          });
        }

        let votosSlateTotal = 0;
        circuit.slateVotesList.forEach((slate) => {
          votosSlateTotal += slate.votes;
        });

        // Sumar votos extras
        const votosExtrasTotal =
          circuitList.circuitNullVotes +
          circuitList.circuitBlankVotes +
          circuitList.circuitRecurredVotes +
          circuitList.circuitObservedVotes;

        // Actualizar el estado global con los totales
        dispatch(formActions.setVotosSlateTotalRedux(votosSlateTotal));
        dispatch(formActions.setVotosPartyTotalRedux(votosPartyTotal)); // Slate votos está contenido dentro de Party votos (partido propio)
        dispatch(formActions.setVotosExtrasTotalRedux(votosExtrasTotal));
      } catch (error) {
        console.error("Error al obtener los votos por circuito:", error);
      }
    };
  }
};

export const fetchRoleList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.roleFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }

      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setRoleList(dataArray));
    } catch (error) {}
  };
};

export const fetchCandidateList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.candidateFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }

      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setCandidateList(dataArray));
    } catch (error) {}
  };
};

export const fetchDelegateList = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(FirebaseUrls.delegadoFinal);
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }

      return await response.json();
    };

    try {
      const data = await fetchData();

      // Transformamos el objeto en un array de objetos, descartando las claves generadas por Firebase
      const dataArray = Object.keys(data).map((key) => {
        return {
          ...data[key],
          pushId: key, // Opcionalmente, podrías incluir el ID de Firebase si lo necesitas más adelante
        };
      });

      dispatch(generalDataActions.setDelegateList(dataArray));
    } catch (error) {}
  };
};
