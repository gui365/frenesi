import React from 'react';
import './CardsArea.scss';
import Card from '../Card';

const CardsArea = ({ answers }) => {
  return (
    <>
      {
        !!answers.length &&
        <div id='cardsarea'>
          {answers.map(card => {
            return <Card key={card.id} content={card.content} type='answer' />
          })}
        </div>
      }
    </>
  )
};

export default CardsArea;