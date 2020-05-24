import React from 'react';
// import React, { useState } from 'react';
import './Card.scss';

const Card = ({ content, type, onClick }) => {

  // Use this hook in order to unmount card after played
  // const [showCard, setShowCard] = useState(true);

  return (
    <>
      {
        // showCard && 
        type === 'answer' && content &&
        <div onClick={onClick} className={`card ${type}`} id={type === 'interactive' ? 'dropzone' : null}>
          <p className='card-content'>{content}</p>
        </div>
      }
      {
        type !== 'answer' && content &&
        <div onClick={onClick} className={`card ${type}`} id={type === 'interactive' ? 'dropzone' : null}>
          <p className='card-content'>{content}</p>
        </div>
      }
    </>
  )
};

export default Card;