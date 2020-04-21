import React from 'react';
import './Spinner.scss';

const Spinner = ({
  alt,
  height = '50px',
  styleImg,
  text,
  width = '50px',
  ...rest
}) => {
  return (
    <div className='spinner-div'>
      <img
        className='spinner-img'
        style={{ width, height, ...styleImg }}
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