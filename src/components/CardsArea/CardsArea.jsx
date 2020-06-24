import React, { Component } from 'react';
import './CardsArea.scss';
import Card from '../Card';

class CardsArea extends Component {
  // ({ answers, handlePlayCard, answersRequired }) =>
  state = {
    answerCards: [],
    numCardsPlayed: 0,
    cardsPlayedContent: [],
    cardsPlayedObject: []
  }

  componentDidMount() {
    this.setState({
      answerCards: this.props.answers
    });
  }

  handleSelectCard = card => {
    this.setState({
      numCardsPlayed: this.state.numCardsPlayed + 1,
      cardsPlayedContent: [...this.state.cardsPlayedContent, card.content],
      cardsPlayedObject: [...this.state.cardsPlayedObject, card]
    }, () => {
      console.log(this.props.answersRequired);
      console.log(this.state.cardsPlayedContent.length);
      console.log(this.state.numCardsPlayed);

      if (this.props.answersRequired === this.state.cardsPlayedContent.length) {
        this.props.handlePlayCard(this.state.answerCards, this.state.cardsPlayedObject);
      }
    });
  }

  render() {
    return (
      <>
        {
          this.state.answerCards && (
            <div id='cardsarea'>
              {this.state.answerCards.length &&
                <p className="message-small">Quedan <span style={{ fontWeight: 'bold' }}>{this.state.answerCards.length - 7}</span> cartas por jugador</p>
              }
              {
                this.state.numCardsPlayed === this.props.answersRequired &&
                <p className="message-large"><span className="bold">Jugaste:</span> {this.state.cardsPlayedContent.length > 1 ? this.state.cardsPlayedContent.join(" | ") : this.state.cardsPlayedContent[0]}</p>
              }
              {
                // This may not be working properly every time...
                !!this.state.answerCards.length && this.state.numCardsPlayed === 0
                  ?
                  this.state.answerCards.slice(0, 7).map(card => {
                    return (
                      <Card
                        content={card.content}
                        type='answer'
                        key={card.id}
                        onClick={() => { this.handleSelectCard(card) }}
                      />
                    )
                  })
                  : !!this.state.answerCards.length && this.state.numCardsPlayed === 1
                    ? this.state.answerCards.slice(0, 7).filter(card => card.id !== this.state.cardsPlayedObject[0].id).map(card => {
                      return (
                        <Card
                          content={card.content}
                          type='answer'
                          key={card.id}
                          onClick={() => { this.handleSelectCard(card) }}
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
  }
};

export default CardsArea;