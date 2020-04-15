import React from 'react';
import './Spinner.scss';

const Spinner = ({
  width = '50px',
  height = '50px',
  alt,
  text,
  ...rest
}) => {
  return (
    <div className='spinner-div'>
      <img
        className='spinner-img'
        style={{ width, height }}
        src={'/images/spinner3s.gif'}
        alt={alt || 'spinner image'}
        {...rest}
      />
      {
        text &&
        <span className='spinner-text'>{text}</span>
      }
    </div>
  )
};

export default Spinner;