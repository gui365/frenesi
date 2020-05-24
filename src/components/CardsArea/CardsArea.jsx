import React, { useState, useEffect } from 'react';
import './CardsArea.scss';
import Card from '../Card';

const CardsArea = ({ answers, handlePlayCard, answersRequired }) => {
  const [answerCards, setAnswerCards] = useState([]);

  useEffect(() => {
    setAnswerCards(answers);
  }, [answers]);

  const handleSelectCard = card => {
    console.log(card);
    
  }

  return (
    <>
      {
        answerCards && (
          <div id='cardsarea'>
            <p id="message-cards-left">Quedan <span style={{ fontWeight: 'bold' }}>{answerCards.length - 7}</span> cartas por jugador</p>
            {
              !!answerCards.length && answerCards.length !== answerCards.length - answersRequired
                ? 
                answerCards.slice(0, 7).map(card => {
                  return (
                    <Card
                      content={card.content}
                      type='answer'
                      key={card.id}
                      // onClick={() => { handlePlayCard(answerCards, card) }}
                      onClick={() => { handleSelectCard(card) }}
                    />
                  )
                })
                : <p>Esperando a que todos jueguen</p>
            }
          </div>
        )
      }
    </>
  )
};

export default CardsArea;