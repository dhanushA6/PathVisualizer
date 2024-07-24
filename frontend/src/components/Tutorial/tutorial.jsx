// src/components/Tutorial/Tutorial.js

import React, { useState } from 'react';
import tutorialSteps from '../../data/tutorial';
import './tutorial.css';

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-container">
        <h1>{tutorialSteps[currentStep].title}</h1>
        <p>{tutorialSteps[currentStep].content}</p> 
        <p>{tutorialSteps[currentStep].sub_content}</p>
        {tutorialSteps[currentStep].image && (
                    <img src={tutorialSteps[currentStep].image} alt="tutorial step" />
                )} 
        {tutorialSteps[currentStep].gif && (
                <img src={tutorialSteps[currentStep].gif} alt="tutorial step" style={{ width: '100%' }} />
            )}
        <div className="tutorial-controls">
          <button onClick={handleSkip}>Skip Tutorial</button>
          <button  id = "previous" onClick={handlePrevious} disabled={currentStep === 0}>Previous</button>
          <button onClick={handleNext}>{currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}</button>
         
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
