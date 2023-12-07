import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { format } from "date-fns";
import { database } from "../../../utils/firebaseSetup";
import { ref, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

import {
  CForm,
  CButton,
  CCol,
  CRow,
  CCard,
  CCardTitle,
  CCardBody,
  CCardFooter,
  CFormTextarea,
} from "@coreui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { LoadingSpinner } from "../../../utils/LoadingSpinner";
import WidgetsBrandParty from "../widgets/WidgetsBrandParty";

// redux imports
import { useSelector, useDispatch } from "react-redux";
// import { fetchCircuitList } from "../../../store/generalData-actions";
import { liveSettingsActions } from "../../../store/liveSettings-slice";
import { uiActions } from "../../../store/ui-slice";
import { formActions } from "../../../store/form-slice";

import "./FormExtras2.css";

const buttonColor = "dark";
const CIRCUIT_IMAGES_PATH = `assets/images/circuits/`;

const initialFixedCards = [
  {
    cardId: "circuitNullVotes",
    cardName: "Anulados",
    cardImageURL:
      "https://drive.google.com/uc?export=view&id=18d10-GServQQgFEL8OlvxNh_YfGsw02Y",
    cardVotes: 0,
  },
  {
    cardId: "circuitBlankVotes",
    cardName: "En blanco",
    cardImageURL:
      "https://drive.google.com/uc?export=view&id=18gE304z_OvtLab7nnw8J5C4AakAcJQix",
    cardVotes: 0,
  },
  {
    cardId: "circuitRecurredVotes",
    cardName: "Recurridos",
    cardImageURL:
      "https://drive.google.com/uc?export=view&id=18cqhAnXBfn6bO2jo6CiKlm_Li8EeD4Uf",
    cardVotes: 0,
  },
  {
    cardId: "circuitObservedVotes",
    cardName: "Observados",
    cardImageURL:
      "https://drive.google.com/uc?export=view&id=18gsrr32FBc6lpOo_B4zcmlTW8HWT-sJY",
    cardVotes: 0,
  },
];

// Definimos fetchImages fuera del componente para evitar re-creaciones innecesarias
const fetchImages = async (circuitId) => {
  const storage = getStorage();
  const imagesRef = storageRef(storage, `${CIRCUIT_IMAGES_PATH}${circuitId}`);
  const result = await listAll(imagesRef);
  return Promise.all(
    result.items.map(async (imageRef) => {
      const url = await getDownloadURL(imageRef);
      return { url, name: imageRef.name };
    })
  );
};

const FormExtras2 = (props) => {
  //#region Consts ***********************************

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisabledExtras, setIsDisabledExtras] = useState(false);
  const [isValidArrayExtras, setIsValidArrayExtras] = useState([true]);
  const [isValidFormExtras, setIsValidFormExtras] = useState(true);
  const [isSuccessExtras, setIsSuccessExtras] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagesList, setImagesList] = useState([]);
  const [fixedCards, setFixedCards] = useState(initialFixedCards);
  const [votosExtrasTotal, setVotosExtrasTotal] = useState(0);
  const [txbComments, setTxbComments] = useState("");
  const [circuit, setCircuit] = useState(null);

  const delegadoId = useSelector((state) => state.auth.userId);

  // redux gets
  const reduxSelectedCircuit = useSelector(
    (state) => state.liveSettings.circuit
  );

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  // Esta función suma todos los votos extras de las tarjetas
  const sumarVotosExtras = (tarjetas) => {
    return tarjetas.reduce(
      (acumulado, tarjeta) => acumulado + tarjeta.cardVotes,
      0
    );
  };

  useEffect(() => {
    // Calcula el total de votos extras cada vez que 'fixedCards' cambie
    const totalVotosExtras = sumarVotosExtras(fixedCards);
    setVotosExtrasTotal(totalVotosExtras);
    props.setTOTALVotosExtras(totalVotosExtras);

    // SET REDUX ACA
    dispatch(formActions.setVotosExtrasTotalRedux(totalVotosExtras));
  }, [fixedCards, props.setTOTALVotosExtras]); // Dependencia 'fixedCards' asegura que el efecto se ejecute cada vez que cambian los votos

  useEffect(() => {
    // Actualiza el estado local 'circuit' con el valor del circuito seleccionado en Redux.
    const updateCircuitData = (circuit) => {
      setCircuit(circuit);
      if (circuit) {
        fetchImages(circuit.circuitId)
          .then((imageObjects) => {
            setImagesList(imageObjects);
          })
          .catch((error) => {
            console.error("Error fetching images:", error);
          });
      }
    };

    if (reduxSelectedCircuit) {
      // Define los datos del circuito en función de reduxSelectedCircuit
      const circuitData = {
        pushId: reduxSelectedCircuit.pushId,
        nullVotes: reduxSelectedCircuit.circuitNullVotes,
        blankVotes: reduxSelectedCircuit.circuitBlankVotes,
        recurredVotes: reduxSelectedCircuit.circuitRecurredVotes,
        observedVotes: reduxSelectedCircuit.circuitObservedVotes,
      };

      setTxbComments(reduxSelectedCircuit.circuitComments);

      // Calcula y establece el total de votos extras.
      const totalVotes =
        circuitData.nullVotes +
        circuitData.blankVotes +
        circuitData.recurredVotes +
        circuitData.observedVotes;
      props.setTOTALVotosExtras(totalVotes);

      // Actualiza las fotos del circuito basado en el seleccionado de Redux.
      updateCircuitData(reduxSelectedCircuit);
    }
  }, []);

  useEffect(() => {
    // Asegúrate de que newVotes no sea nulo o undefined y tenga la forma esperada
    if (reduxSelectedCircuit && Object.keys(reduxSelectedCircuit).length > 0) {
      setFixedCards((prevCards) => {
        return prevCards.map((card) => {
          // Si newVotes tiene una entrada para el cardId actual, actualízalo
          const newVoteCount = reduxSelectedCircuit[card.cardId];
          return {
            ...card,
            cardVotes:
              newVoteCount !== undefined ? newVoteCount : card.cardVotes,
          };
        });
      });
    }
  }, [reduxSelectedCircuit]); // La dependencia es newVotes, así que este efecto se ejecutará cada vez que newVotes cambie

  useEffect(() => {
    if (isSuccessExtras) {
      dispatch(
        uiActions.setStepsSubmitted({ step: "step3", isSubmitted: true })
      );

      setTimeout(() => {
        // Poner step Resumen en azul (activo)
        navigate("/FormSummary");
      }, 100);
    }
  }, [isSuccessExtras, dispatch]);

  //#endregion Hooks ***********************************

  //#region Events ***********************************

  const handleDeleteImage = async (imageURL) => {
    // Pedir confirmación antes de proceder
    const confirm = window.confirm(`¿Estás seguro de que quieres borrar?`);
    if (!confirm) {
      return; // Si el usuario no confirma, detener la función aquí
    }

    // Crear una referencia a la imagen para borrarla
    const storage = getStorage();
    const deleteRef = storageRef(storage, imageURL);

    try {
      await deleteObject(deleteRef);
      console.log(`Imagen ${imageURL} borrada con éxito`);
      // Actualizar el estado para remover la imagen borrada de la lista
      setImagesList(imagesList.filter((image) => image.url !== imageURL));

      // Decrementa el contador de imágenes subidas para el circuito
      if (circuit && circuit.pushId) {
        const circuitRef = ref(database, `circuitList/${circuit.pushId}`);
        let count = Math.max(
          (reduxSelectedCircuit.circuitImagesUploadedCount || 0) - 1,
          0
        );
        update(circuitRef, {
          circuitImagesUploadedCount: count,
        });

        // Actualiza el selected circuit con la cantidad de imágenes nuevas
        if (reduxSelectedCircuit && reduxSelectedCircuit.circuitId) {
          const updatedSelectedCircuit = {
            ...reduxSelectedCircuit,
            circuitImagesUploadedCount: count,
          };

          dispatch(
            liveSettingsActions.setSelectedCircuit(updatedSelectedCircuit)
          );
        }
      }
    } catch (error) {
      console.error("Error al borrar la imagen:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file); // Aquí faltaba asignar el archivo a la variable de estado imageFile
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formSubmitHandlerExtras = async (event) => {
    event.preventDefault();
    const allValid = isValidArrayExtras.every(Boolean);

    if (!allValid) {
      setIsValidFormExtras(false);
      return;
    }

    setIsValidFormExtras(true);
    setIsDisabledExtras(true);
    props.setIsLoading(true); // Inicia el indicador de carga

    // Define 'count' aquí para que sea accesible en todo el cuerpo de la función
    let count = reduxSelectedCircuit.circuitImagesUploadedCount || 0;

    try {
      // Si hay un archivo de imagen, subir primero
      if (imageFile) {
        await handleUpload(); // handleUpload ya actualiza el contador en Firebase
        count++; // Incrementa el contador localmente
      }

      // Luego actualizar votos en Firebase
      await updateVotesInFirebase(
        reduxSelectedCircuit.pushId, // pushId del circuito seleccionado
        fixedCards, // array de tarjetas con votos
        txbComments
      );

      setIsSuccessExtras(true); // Si no hay error, la actualización fue exitosa
      updateCircuitStep(); // Llama a la función para actualizar el circuito aquí, después de la actualización exitosa
      setTxbComments("");
    } catch (error) {
      console.error("Error en el proceso de envío:", error);
      setIsSuccessExtras(false); // Si hay error, la actualización no fue exitosa
    }

    props.setIsLoading(false); // Detiene el indicador de carga, independientemente del resultado

    // Redux fetch DB
    // await dispatch(fetchCircuitList()); // refresh DB data

    const fixedCardsVotes = fixedCards.map((card) => ({
      id: card.cardId,
      votes: card.cardVotes,
    }));

    if (reduxSelectedCircuit && reduxSelectedCircuit.circuitId) {
      // Crear un objeto para mapear los votos de fixedCards a las propiedades de reduxSelectedCircuit
      const updatedVotes = fixedCards.reduce((acc, card) => {
        const voteKey = card.cardId.replace("circuit", ""); // Transforma "circuitNullVotes" en "NullVotes"
        acc[voteKey.charAt(0).toLowerCase() + voteKey.slice(1)] =
          card.cardVotes; // Convierte "NullVotes" en "nullVotes" y asigna el valor
        return acc;
      }, {});

      const updatedSelectedCircuit = {
        ...reduxSelectedCircuit,
        step3completed: true,
        circuitImagesUploadedCount: count,
        circuitComments: txbComments,

        circuitNullVotes: updatedVotes.nullVotes,
        circuitBlankVotes: updatedVotes.blankVotes,
        circuitRecurredVotes: updatedVotes.recurredVotes,
        circuitObservedVotes: updatedVotes.observedVotes,
      };
      dispatch(liveSettingsActions.setSelectedCircuit(updatedSelectedCircuit));
    }
  };

  const updateCircuitStep = () => {
    // Verifica si se seleccionó un circuito
    if (reduxSelectedCircuit && reduxSelectedCircuit.circuitId) {
      // Define la referencia al circuito específico
      const circuitRef = ref(
        database,
        `circuitList/${reduxSelectedCircuit.pushId}`
      );

      // Actualiza el campo step3completed a true
      update(circuitRef, {
        step3completed: true,
        lastUpdateDelegadoId: delegadoId,
      })
        .then(() => {})
        .catch((error) => {
          console.error("Error al actualizar el circuito:", error);
        });

      // Actualizar step en Redux
      dispatch(liveSettingsActions.setStepCompletedCircuit(3));
    }
  };

  const validityHandlerExtras = (index, isValid) => {
    setIsValidArrayExtras((prevIsValidArray) => {
      const updatedIsValidArray = [...prevIsValidArray];
      updatedIsValidArray[index] = isValid;
      return updatedIsValidArray;
    });
  };

  const updateVotesHandlerExtras = (cardId, newVotes) => {
    setFixedCards((currentFixedCards) => {
      return currentFixedCards.map((card) => {
        if (card.cardId == cardId) {
          // Solo actualiza el cardVotes del card correspondiente
          return { ...card, cardVotes: newVotes };
        } else {
          // Para los demás cards, devuelve el objeto como está
          return card;
        }
      });
    });
  };

  //#endregion Events ***********************************

  //#region Functions ***********************************

  const handleUpload = async () => {
    let count = reduxSelectedCircuit.circuitImagesUploadedCount || 0;
    if (imageFile && circuit) {
      const storage = getStorage();
      const dateTimeString = format(new Date(), "yyyy-MM-dd-HHmmss");
      const newImageName = `circuito_${circuit.circuitId}_${dateTimeString}`;

      // Se crea una referencia con el nuevo nombre de la imagen
      const storageReference = storageRef(
        storage,
        `${CIRCUIT_IMAGES_PATH}${circuit.circuitId}/${newImageName}`
      );

      try {
        const uploadTask = await uploadBytes(storageReference, imageFile);
        const downloadUrl = await getDownloadURL(uploadTask.ref);
        setImageUrl(downloadUrl); // Guarda la URL de la imagen para usarla luego
        console.log("Imagen cargada con éxito:", downloadUrl);

        // Llamamos a fetchImages con el circuitId para obtener la lista actualizada de imágenes
        const updatedImages = await fetchImages(circuit.circuitId);
        setImagesList(updatedImages); // Actualizamos el estado con la nueva lista de imágenes

        // Incrementa el contador de imágenes subidas para el circuito
        if (circuit && circuit.pushId) {
          count = count + 1;
          const circuitRef = ref(database, `circuitList/${circuit.pushId}`);
          update(circuitRef, {
            circuitImagesUploadedCount: count,
          });
        }
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
      }
    }
    return count;
  };

  const updateVotesInFirebase = async (pushId, fixedCards, circuitComments) => {
    try {
      const updates = {};
      fixedCards.forEach((card) => {
        updates[`/circuitList/${pushId}/${card.cardId}`] = card.cardVotes;
      });

      if (circuitComments) {
        // Agrega esta línea para actualizar los comentarios del circuito
        updates[`/circuitList/${pushId}/circuitComments`] = circuitComments;
      }
      await update(ref(database), updates);
    } catch (error) {
      console.error(`Error al actualizar los votos en Firebase:`, error);
    }
  };

  const cardList = fixedCards.map((card, index) => {
    return (
      <WidgetsBrandParty
        key={index}
        id={String(card.cardId)}
        title={card.cardName}
        defaultValue={card.cardVotes}
        onValidityChange={(isValid, votes) =>
          validityHandlerExtras(index, isValid)
        }
        onUpdateVotes={(newVotes) =>
          updateVotesHandlerExtras(card.cardId, +newVotes)
        }
        disabled={isDisabledExtras}
        otherVotes={Number(props.TOTALVotosGLOBAL)}
        name={card.cardName}
        imageURL={card.cardImageURL}
        maxValue={500}
        currentGlobalVotes={votosExtrasTotal}
      />
    );
  });
  //#endregion Functions ***********************************

  //#region JSX props ***********************************

  const labelSelectCircuit = (
    <span style={{ color: "blue", fontStyle: "italic", width: "auto" }}>
      Seleccione un circuito.
    </span>
  );

  //#endregion JSX props ***********************************

  return (
    <>
      <CForm
        onSubmit={formSubmitHandlerExtras}
        style={{ paddingBottom: "4rem" }}
      >
        <CRow className="justify-content-center">
          {props.isLoading ? (
            <LoadingSpinner />
          ) : reduxSelectedCircuit ? (
            cardList
          ) : (
            <>
              {labelSelectCircuit}
              <br />
              <br />
            </>
          )}
        </CRow>
        <CRow className="justify-content-center">
          <CCol sm={6} lg={3}>
            <CCard className="text-center">
              &nbsp;
              <CCardTitle>Comentarios</CCardTitle>
              <CCardBody>
                <CFormTextarea
                  id="txbComments"
                  value={txbComments}
                  onChange={(e) => setTxbComments(e.target.value)}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <br />
        <CRow className="justify-content-center">
          <CCol sm={6} lg={3}>
            <CCard className="text-center">
              &nbsp;
              <CCardTitle>Carga del Acta Oficial</CCardTitle>
              <CCardBody>
                <ul
                  className="left-aligned-list"
                  style={{ paddingLeft: "12px" }}
                >
                  {imagesList.map((image, index) => (
                    <li key={index}>
                      {image.name}
                      &nbsp;
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar
                      </a>
                      &nbsp;
                      <FontAwesomeIcon
                        icon={faTimes}
                        onClick={() => handleDeleteImage(image.url)}
                        className="text-danger"
                      />
                    </li>
                  ))}
                </ul>

                <br />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CCardFooter
          className="text-medium-emphasis"
          style={{ textAlign: "center" }}
        >
          <div style={{ textAlign: "center" }}>
            <CButton type="submit" color={buttonColor}>
              Siguiente
            </CButton>
          </div>
        </CCardFooter>
      </CForm>
    </>
  );
};

export default FormExtras2;
