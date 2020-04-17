import React from 'react';
import './Button.scss';

const Button = ({
  content,
  clickHandler,
  icon,
  imageProps,
  isDisabled = false,
  type,
  ...rest }) => {
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
            {...imageProps}
          />
        }
        {content}
      </button>
    </>
  )
};

export default Button;