import React from 'react';
// import React, { useState } from 'react';
import './Card.scss';

const Card = ({ content, type }) => {

  // Use this hook in order to unmount card after played
  // const [showCard, setShowCard] = useState(true);

  return (
    <>
      {
        // showCard && 
        type === 'answer' && content &&
        <div className={`card ${type}`} id={type === 'interactive' ? 'dropzone' : null}>
          <p className='card-content'>{content}</p>
        </div>
      }
      {
        type !== 'answer' && content &&
        <div className={`card ${type}`} id={type === 'interactive' ? 'dropzone' : null}>
          <p className='card-content'>{content}</p>
        </div>
      }
    </>
  )
};

export default Card;