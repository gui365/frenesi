import React from 'react';
import './JudgeArea.scss';
import { shuffle } from '../../utils/utils';

const JudgeArea = ({ players, playedCards, handlePickWinner, showWinnerModal }) => {
  return (
    <div id='judgearea'>
      <img id='icon-referee' src='/images/icon-referee.png' alt='referee icon' />
      {
        !!players && !!playedCards && Object.keys(players).length - 1 !== Object.entries(playedCards).length
          ? <p className='message-judge'>Te toca ser el juez. Por favor, espera a que todos los jugadores jueguen sus cartas</p>
          :
          <>
            <p className='message-judge'>Elegi la carta ganadora</p>
            {shuffle(shuffle(Object.values(playedCards))).map((card, index) => {
              return <button
                className={showWinnerModal ? 'played-card disabled' : 'played-card'}
                key={`played-card-${index}`}
                type='button'
                disabled={!!showWinnerModal}
                onClick={() => { handlePickWinner(card) }}
              >
                {card.content}
              </button>
            })}
          </>
      }
    </div>
  )
};

export default JudgeArea;