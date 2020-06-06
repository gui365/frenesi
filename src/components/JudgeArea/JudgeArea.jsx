import React from 'react';
import './JudgeArea.scss';

const JudgeArea = ({ players, playedCards, handlePickWinner }) => {
  return (
    <div id='judgearea'>
      <img id='icon-referee' src='/images/icon-referee.png' alt='referee icon' />
      {
        !!players && !!playedCards && Object.keys(players).length - 1 !== Object.entries(playedCards).length
          ? <p className='message-judge'>Te toca ser el juez. Por favor, espera a que todos los jugadores jueguen sus cartas</p>
          :
          <>
            <p className='message-judge'>Elegi la carta ganadora</p>
            {Object.values(playedCards).map((card, index) => {
              return <p
                className='played-card'
                key={`played-card-${index}`}
                onClick={() => { handlePickWinner(card) }}
                >
                {card.content}
              </p>
            })}
          </>
      }
    </div>
  )
};

export default JudgeArea;