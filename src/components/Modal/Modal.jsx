import React from 'react';
import './Modal.scss';

const Modal = ({ winner, playedCards }) => {
  return (
    <div className='d-flex a-center j-center modal-wrapper'>
      <div className='d-flex a-center j-center flex-direction-column' id='modal-winner'>
        <p className='winner-title'>Ganador/a</p>
        <p className='winner-content bold'>
          {playedCards.map(card => {
            let cardContent;
            if (card.owner === winner) {
              cardContent = card.content;
            }
            return cardContent;
          })}
        </p>
        <p className='winner-name bold'>{winner}</p>
      </div>
    </div>
  )
}

export default Modal;