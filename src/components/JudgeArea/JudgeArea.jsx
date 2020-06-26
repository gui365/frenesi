import React from 'react';
import './JudgeArea.scss';
import { shuffle } from '../../utils/utils';

const JudgeArea = ({ handlePickWinner, isJudge, players, playedCards, showWinnerModal }) => {
  return (
    <div id='judgearea'>
      {
        isJudge &&
        <img id='icon-referee' src='/images/icon-referee.png' alt='referee icon' />
      }
      {
        !!players && !!playedCards && Object.keys(players).length - 1 !== Object.entries(playedCards).length
          ? <p className='message-judge'>Te toca ser el juez. Por favor, espera a que todos los jugadores jueguen sus cartas</p>
          :
          <>
            {
              isJudge &&
              <p className='message-judge'>Elegi la carta ganadora</p>
            }
            {shuffle(shuffle(Object.values(playedCards))).map((card, index) => {
              return <button
                style={{ whiteSpace: 'pre-wrap' }}
                className={`played-card ${showWinnerModal ? 'disabled' : ''}`}
                key={`played-card-${index}`}
                type='button'
                disabled={showWinnerModal || !isJudge}
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