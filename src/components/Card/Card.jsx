import React from 'react';
import './Card.scss';

const Card = ({ content, type, onClick }) => {

  return (
    <>
      {
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