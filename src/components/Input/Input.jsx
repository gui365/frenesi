import React from 'react';
import './Input.scss';

const Input = ({ label, name, changeFunction, type }) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input name={name} onChange={changeFunction} type={type} />
    </>
  )
};

export default Input;