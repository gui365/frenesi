import React, { useState, useEffect } from 'react';
import './CardsArea.scss';
import Card from '../Card';

const CardsArea = ({ answers, handlePlayCard, answersRequired }) => {
  const [answerCards, setAnswerCards] = useState([]);
  const [numCardsPlayed, setNumCardsPlayed] = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState([]);

  useEffect(() => {
    setAnswerCards(answers);
  }, [answers]);

  const handleSelectCard = card => {
    setNumCardsPlayed(numCardsPlayed + 1);
    setCardsPlayed([...cardsPlayed, card.content]);
    handlePlayCard(answerCards, card);
  }

  return (
    <>
      {
        answerCards && (
          <div id='cardsarea'>
            <p className="message-small">Quedan <span style={{ fontWeight: 'bold' }}>{answerCards.length - 7}</span> cartas por jugador</p>
            {
              numCardsPlayed === answersRequired &&
              <p className="message-large"><span className="bold">Jugaste:</span> {cardsPlayed.length > 1 ? cardsPlayed.join(" | ") : cardsPlayed[0]}</p>
            }
            {
              !!answerCards.length && numCardsPlayed !== answersRequired
                ? 
                answerCards.slice(0, 7).map(card => {
                  return (
                    <Card
                      content={card.content}
                      type='answer'
                      key={card.id}
                      onClick={() => { handleSelectCard(card) }}
                      // onClick={() => { handleSelectCard(card) }}
                    />
                  )
                })
                : <p className="message-large bold">Esperando a que todos jueguen</p>
            }
          </div>
        )
      }
    </>
  )
};

export default CardsArea;