import React from 'react';
import './Logo.scss';

const Logo = () => {
  return (
    <div className='d-flex a-center j-center flex-direction-column'>
      <img id="star-icon" src="/images/star.ico" alt="star-icon"></img>
      <img id="logo" src="/images/logo.png" alt="Frenesi logo" />
    </div>
  )
};

export default Logo;