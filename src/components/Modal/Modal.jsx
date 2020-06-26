import React from 'react';
import './Modal.scss';
import { ModalType } from '../../constants/modalType';
import Spinner from '../Spinner';

const Modal = ({ modalType, winner, playedCards, winnerCardContent }) => {
  return (
    modalType === ModalType.WINNER
      ? (
        <div className='d-flex a-center j-center modal-wrapper'>
          <div className='d-flex a-center j-center flex-direction-column' id='modal-winner'>
            <p className='winner-title'>Ganador/a</p>
            <p className='winner-content bold' style={{ whiteSpace: 'pre-wrap' }}>
              {winnerCardContent}
            </p>
            <p className='winner-name bold'>{winner}</p>
          </div>
        </div>
      )
      : (
        <div className='d-flex a-center j-center modal-wrapper'>
          <div className='d-flex a-center j-center flex-direction-column' id='modal-loading'>
            <p className='loading-message bold'>Cargando la proxima ronda...</p>
            <Spinner />
          </div>
        </div>
      )
  )
}

export default Modal;