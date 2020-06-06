import React from 'react';
import './Modal.scss';

const Modal = ({ winner }) => {
  return (
    <div className='d-flex a-center j-center modal-wrapper'>
      <div className='d-flex a-center j-center flex-direction-column' id='modal-winner'>
        <p className='winner-title'>Ganador/a</p>
        <p className='winner-name bold'>{winner}</p>
      </div>
    </div>
  )
}

export default Modal;