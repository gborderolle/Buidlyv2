import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";

import "./RadioButtonStepper.css";

const RadioButtonStepper = (props) => {
  //#region Consts ***********************************
  const steps = ["Listas", "Partidos", "Extras"];

  const [stepsSubmitted, setStepsSubmitted] = useState(props.currentStep);
  const [complete, setComplete] = useState(false);

  //#endregion Consts ***********************************

  //#region Hooks ***********************************
  useEffect(() => {
    setStepsSubmitted(props.currentStep);
  }, [props.currentStep]);

  useEffect(() => {
    // Verificar si todos los pasos están completos
    const allStepsCompleted = Object.values(stepsSubmitted).every(Boolean);
    setComplete(allStepsCompleted);
  }, [stepsSubmitted]);

  //#endregion Hooks ***********************************

  //#region JSX ***********************************
  return (
    <>
      <div className={`flex justify-between`} style={{ display: "flex" }}>
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${
              stepsSubmitted[`step${i + 1}completed`] && "complete"
            }`}
          >
            <div className="step">
              {stepsSubmitted[`step${i + 1}`] ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>
      {complete && (
        <div style={{ textAlign: "center" }}>¡Proceso completo!</div>
      )}
    </>
  );
  //#endregion JSX ***********************************
};

export default RadioButtonStepper;
