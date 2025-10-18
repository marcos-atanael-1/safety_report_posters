import React from 'react'

const StepNavigation = ({ currentStep, maxStep }) => {
  return (
    <nav className="step-navigation">
      <div className="step-indicator">
        {Array.from({ length: maxStep }, (_, index) => {
          const stepNum = index + 1
          let className = 'step-dot'
          let content = stepNum
          
          if (stepNum === currentStep) {
            className += ' active'
          } else if (stepNum < currentStep) {
            className += ' completed'
            content = <i className="fas fa-check"></i>
          }
          
          return (
            <div key={stepNum} className={className} data-step={stepNum}>
              {content}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export default StepNavigation