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
                // This may not be working properly every time...
                !!this.state.answerCards.length && this.state.numCardsPlayed === 0
                  ?
                  this.state.answerCards.slice(0, 7).map(card => {
                    return (
                      <Card
                        content={card.content}
                        type='answer'
                        key={card.id}
                        onClick={() => { return !this.props.showLoadingModal ? this.handleSelectCard(card) : null }}
                      />
                    )
                  })
                  : !!this.state.answerCards.length && this.props.answersRequired === 2 && this.state.numCardsPlayed === 1 &&
                  this.state.answerCards.slice(0, 7).filter(card => card.id !== this.state.cardsPlayedObject[0].id).map(card => {
                    return (
                      <Card
                        content={card.content}
                        type='answer'
                        key={card.id}
                        onClick={() => { return !this.props.showLoadingModal ? this.handleSelectCard(card) : null }}
                      />
                    )
                  })
              }
            </div>
          )
        }
      </>
    )
  }
};

export default CardsArea;