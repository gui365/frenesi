import React from 'react';
import './Button.scss';

const Button = ({ content, type, clickHandler, isDisabled = false, icon, ...rest }) => {
  return (
    <>
      <button
        disabled={isDisabled}
        type={type || 'button'}
        onClick={clickHandler}
        {...rest}
      >
        {
          icon &&
          <img
            className='button-icon'
            src={`/images/icon-${icon}.png`}
            alt={`${icon} icon`}
          />
        }
        {content}
      </button>
    </>
  )
};

export default Button;