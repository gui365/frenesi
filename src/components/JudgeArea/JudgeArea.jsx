import React from 'react';
import './JudgeArea.scss';

const JudgeArea = ({ haveAllPlayed, playedCards }) => {
  return (
    <div id='judgearea'>
      <img id='icon-referee' src='/images/icon-referee.png' alt='referee icon' />
      {
        !haveAllPlayed
          ? <p className='message-judge'>Te toca ser el juez. Por favor, espera a que todos los jugadores jueguen sus cartas</p>
          : <p className='message-judge'>Elegi la carta ganadora</p>
      }
      {
        !!playedCards.length &&
        playedCards.map((card, index) => {
          return <p className='played-card' key={`played-card-${index}`}>{card.content}</p>
        })
      }
    </div>
  )
};

export default JudgeArea;