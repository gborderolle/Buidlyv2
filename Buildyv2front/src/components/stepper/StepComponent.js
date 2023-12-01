import React, { useEffect, useState } from "react";

import { TiTick } from "react-icons/ti";
import useHighlightedState from "../../utils/useHighlightedState";

import "./StepComponent.css";

const StepComponent = ({ step, index, isCurrent, onClick }) => {
  //#region Const ***********************************
  const [isHighlighted] = useHighlightedState(false, step.stepCompleted);
  const [animate, setAnimate] = useState(false);

  //#endregion Const ***********************************

  //#region Hooks ***********************************

  useEffect(() => {
    if (step.stepCompleted) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 300); // La duración de la animación bump es 300ms, entonces reseteamos después de que termine.
      return () => clearTimeout(timer);
    }
  }, [step.stepCompleted]);

  //#endregion Hooks ***********************************

  return (
    <div
      className={`step-item ${isCurrent ? "active" : ""} ${step.stepCompleted ? "complete" : ""} ${isHighlighted ? "highlighted" : ""} ${animate ? "bump" : ""}`}
      onClick={() => onClick(index)}
    >
      <div className="step">
        {step.stepCompleted ? <TiTick size={24} /> : index + 1}
      </div>
      <p className="text-gray-500">{step.name}</p>
    </div>
  );
};

export default StepComponent;
