import React, { useState, useEffect } from 'react';
import './Modal.scss';
import { ModalType } from '../../constants/modalType';
import Spinner from '../Spinner';

const Modal = ({ modalType, winner, winnerCardContent, gameWinner }) => {

  const [timer, setTimer] = useState(10);

  useEffect(() => {
    setTimeout(() => {
      if (timer > 0) {
        let newTimer = timer - 1;
        setTimer(newTimer);
      } else {
        clearTimeout();
      }
    }, 1000);
  }, [timer]);

  const getModalContent = () => {
    switch (modalType) {
      case ModalType.WINNER:
        return (
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
      case ModalType.LOADING:
        return (
          <div className='d-flex a-center j-center modal-wrapper'>
            <div className='d-flex a-center j-center flex-direction-column' id='modal-loading'>
              <p className='loading-message bold'>Cargando la proxima ronda...</p >
              <Spinner />
            </div >
          </div >
        )
      case ModalType.GAMEOVER:
        return (
          <div className='d-flex a-center j-center modal-wrapper'>
            <div className='d-flex a-center j-center flex-direction-column' id='modal-gameover'>
              {getGameOverWinners()}
            </div >
          </div >
        )
    }
  }

  const getGameOverWinners = () => {
    return (
      <>
        <div class="pyro">
          <div class="before"></div>
          <div class="after"></div>
        </div>
        <h2 className='bold'>{gameWinner.length == 1 ? 'FELICITACIONES' : 'EMPATE'}</h2>
        <h4 className='bold'>{gameWinner.map(w => w.displayName).join(gameWinner.length == 2 ? ' & ' : ', ')}</h4>
        <h6 className='bold'>{gameWinner[0].wins} puntos</h6>
      </>
    )
  }

  return (
    <>
      {
        timer > 0
        && modalType === ModalType.GAMEOVER
        &&
        <p id="timer">{timer}</p>
      }
      {getModalContent()}
    </>
  );
}

export default Modal;