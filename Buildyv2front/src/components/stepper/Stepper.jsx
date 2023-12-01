import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redux imports
import { useSelector, useDispatch } from "react-redux";

import { TiTick } from "react-icons/ti";
import StepComponent from "./StepComponent";
import useHighlightedState from "../../utils/useHighlightedState";

import "./stepper.css";

const Stepper = (props) => {
  //#region Consts ***********************************

  const [enrichedStepList, setEnrichedStepList] = useState([]);

  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux get
  const reduxSelectedCircuitStep1completed = useSelector(
    (state) => state.liveSettings.circuit?.step1completed
  );
  const reduxSelectedCircuitStep2completed = useSelector(
    (state) => state.liveSettings.circuit?.step2completed
  );
  const reduxSelectedCircuitStep3completed = useSelector(
    (state) => state.liveSettings.circuit?.step3completed
  );

  const stepList = [
    { name: "Listas", stepKey: "step1completed" },
    { name: "Partidos", stepKey: "step2completed" },
    { name: "Extras", stepKey: "step3completed" },
    { name: "Resumen", stepKey: "step4completed" },
  ];

  // Obtener los pasos completados desde Redux
  const stepsSubmitted = useSelector((state) => state.ui.currentStepsSubmitted);

  // Determinar el paso actual basado en los pasos completados
  const getCurrentStep = () => {
    if (stepsSubmitted.step3) return 4;
    if (stepsSubmitted.step2) return 3;
    if (stepsSubmitted.step1) return 2;
    return 1;
  };

  const [currentStep, setCurrentStep] = useState(getCurrentStep());

  //#endregion Consts ***********************************

  //#region Hooks ***********************************

  // Actualizar el paso actual y el estado de completado cuando stepsSubmitted cambia
  useEffect(() => {
    setCurrentStep(getCurrentStep());
  }, [stepsSubmitted]);

  // Hook para actualizar la lista de pasos cuando cambian los valores de completitud en Redux
  useEffect(() => {
    const newEnrichedStepList = stepList.map((step) => {
      let stepCompleted = false;
      switch (step.stepKey) {
        case "step1completed":
          stepCompleted = reduxSelectedCircuitStep1completed;
          break;
        case "step2completed":
          stepCompleted = reduxSelectedCircuitStep2completed;
          break;
        case "step3completed":
          stepCompleted = reduxSelectedCircuitStep3completed;
          break;
        case "step4completed":
          stepCompleted = false;
          break;
        default:
          break;
      }
      return { ...step, stepCompleted };
    });
    setEnrichedStepList(newEnrichedStepList);
  }, [
    reduxSelectedCircuitStep1completed,
    reduxSelectedCircuitStep2completed,
    reduxSelectedCircuitStep3completed,
  ]);

  //#endregion Hooks ***********************************

  //#region Functions ***********************************

  const handleStepClick = (stepIndex) => {
    // Actualizar el paso actual
    setCurrentStep(stepIndex + 1);

    // Lógica para determinar a qué ruta navegar basada en el paso
    let path = "";
    switch (stepIndex) {
      case 0:
        path = "/formSlate1";
        break;
      case 1:
        path = "/formParty1";
        break;
      case 2:
        path = "/formExtras1";
        break;
      case 3:
        path = "/formSummary";
        break;
      default:
      // Manejar caso por defecto o error
    }
    // Navegar a la ruta correspondiente
    navigate(path);
  };

  //#endregion Functions ***********************************

  return (
    <>
      <div
        className="flex justify-between"
        style={{
          display: "flex",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {enrichedStepList?.map((step, i) => (
          <StepComponent
            key={i}
            step={step}
            index={i}
            isCurrent={currentStep === i + 1}
            onClick={handleStepClick}
          />
        ))}
      </div>
    </>
  );
};

export default Stepper;
