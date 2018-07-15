import React from 'react';

const Toggle = ({color, size, uniform, onText, offText, onClick, className, active}) => {
  
  let baseClass = `btn btn-${size} btn-toggle`;
  baseClass += uniform ? ` toggle-${color}-uniform` : ` toggle-${color}`;
  if(active){
    baseClass += ' active'
  }

  return (
    <div className={className}>
      {onText}
      <button type="button" className={baseClass} onClick={onClick}>
        <div className="handle"></div>
      </button>
      {offText}
    </div>
  )
}

Toggle.defaultProps = {
  color: 'primary',
  size: 'xs',
  uniform: false,
  onText: 'ON',
  offText: 'OFF',
  active: false,
  className: false
}

export default Toggle;