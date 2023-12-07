import React from "react";
import { useState } from "react";

import {
  CRow,
  CButton,
  CCardFooter,
  CSpinner,
  CCardTitle,
  CCardBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CForm,
  CCard,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from "@coreui/react";
import useInput from "../../../../hooks/use-input";
import useFirebase from "../../../../hooks/use-firebase";

import { format } from "date-fns";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// redux imports
import { useSelector, useDispatch } from "react-redux";
// import { fetchCandidateList } from "../../../../store/generalData-actions";

import "./GroupInput.css";

const GroupInputCandidate = (props) => {
  //#region Consts ***********************************

  const [isValidForm, setIsValidForm] = useState(true); // Declarar e inicializar isValidForm
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const { isLoading, isSuccess, uploadData } = useFirebase();
  const fileInputRef = React.useRef();

  // Redux fetch DB
  const dispatch = useDispatch();

  const {
    value: delegadoName,
    isValid: inputIsValid1,
    hasError: inputHasError1,
    valueChangeHandler: inputChangeHandler1,
    inputBlurHandler: inputBlurHandler1,
    reset: inputReset1,
  } = useInput((value) => value.trim() !== "");

  //#endregion Consts ***********************************

  //#region Functions ***********************************

  // Función para cargar la imagen a Firebase Storage
  const uploadImage = async () => {
    if (image) {
      const storage = getStorage();
      const dateTimeString = format(new Date(), "yyyy-MM-dd-HHmmss");
      const newImageName = `candidato_${dateTimeString}`;

      const storageRef = ref(
        storage,
        `assets/images/candidates/${newImageName}`
      );
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      return url; // Retorna la URL de la imagen
    }
  };

  //#endregion Functions ***********************************

  //#region Events ***********************************

  const imageChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    setIsValidForm(inputIsValid1);

    if (!isValidForm) {
      return;
    }

    // Espera a que la imagen se cargue y obtén la URL
    const uploadedImageURL = await uploadImage();
    // Asegúrate de que la imagen se haya cargado antes de continuar
    if (uploadedImageURL) {
      setImageURL(uploadedImageURL); // Establece la URL de la imagen en el estado

      const dataToUpload = await props.createDataToUpload(
        delegadoName,
        uploadedImageURL
      );

      await uploadData(
        dataToUpload,
        props.firebaseUrlFinal,
        props.firebaseUrlClean
      );

      // Redux fetch DB
      // dispatch(fetchCandidateList()); // refresh DB data

      inputReset1();

      setImage(null);
      setImageURL("");
    } else {
      // Manejar el caso en que la imagen no se cargó
      console.error("La carga de la imagen falló");
    }
  };

  //#endregion Events ***********************************

  return (
    <CForm onSubmit={formSubmitHandler}>
      <CAccordion>
        <CAccordionItem itemKey={1}>
          <CAccordionHeader className="custom-accordion-header">
            {props.title}
          </CAccordionHeader>
          <CAccordionBody>
            <CInputGroup>
              <CInputGroupText className="cardItem custom-input-group-text">
                {props.inputLabel}
              </CInputGroupText>
              <CFormInput
                type="text"
                className="cardItem"
                onChange={inputChangeHandler1}
                onBlur={inputBlurHandler1}
                value={delegadoName}
              />
              {inputHasError1 && (
                <CAlert color="danger" className="w-100">
                  Entrada inválida
                </CAlert>
              )}
            </CInputGroup>
            <br />
            <CInputGroup>
              <CInputGroupText>Imagen</CInputGroupText>
              <CFormInput
                type="file"
                onChange={imageChangeHandler}
                ref={fileInputRef}
              />
            </CInputGroup>
            <br />
            <CRow className="justify-content-center">
              {isLoading && (
                <div className="text-center">
                  <CSpinner />
                </div>
              )}
            </CRow>
            <br />
            <CButton type="submit" color="dark">
              Confirmar
            </CButton>
            <br />
            <br />
            <CCardFooter className="text-medium-emphasis">
              {!isValidForm && (
                <CAlert color="danger" className="w-100">
                  El formulario no es válido
                </CAlert>
              )}
              {isSuccess && (
                <CAlert color="success" className="w-100">
                  Datos ingresados correctamente
                </CAlert>
              )}
            </CCardFooter>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CForm>
  );
};

export default GroupInputCandidate;
