import React from 'react';
import './DropPanel.css';

// A button with a rotating arrow
const RotateButton = ({label, onClick, isOpen, isActive, className, details}) => {
  const iconClasses = "svg-icon" + (isOpen ? " rotate" : "")
  let buttonClass = "btn dropdown-btn "
  buttonClass += (isActive ? " active " : " " )
  buttonClass += (className ? className : "btn-transparent")

  let detailText = (details ? <span className="text-light font-size--3">{details}</span> : null)

  const svg = (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 32 32"
      className={ iconClasses }>
      <path d="M4 23v-5L16 6l12 12v5L16 11 4 23z"/>
    </svg>
  )

  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
      {svg}
      {detailText}
    </button>
  )

}
export default RotateButton
