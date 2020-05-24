import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PlayArea from '../../components/PlayArea/PlayArea';
import CardsArea from '../../components/CardsArea/CardsArea';
import JudgeArea from '../../components/JudgeArea/JudgeArea';
import Spinner from '../../components/Spinner/Spinner';
// import answers from '../../data/cardsAnswers';
// import answersExp from '../../data/cardsAnswersExp01';
import questions from '../../data/cardsQuestions';
import questionsExp from '../../data/cardsQuestionsExp01';
import { getRandomNumber } from '../../utils/utils';
import { fire } from '../../fire';
import './Game.scss';

class Game extends Component {
  state = {
    answers: [],
    // answerCards: [],
    answersRequired: null,
    currentGame: null,
    errorNoGameIdFound: false,
    gameHasBeenSet: false,
    gameOver: false,
    playedCards: [],
    players: [],
    questions: [],
    round: null,
    showSpinner: false,
    thisPlayer: '',
  }

  currentGameId = this.props.match.params.gameId
  db = fire.database();

  // *** FIRST TIME GAME LOADS ***
  // 1. Set in state: questions, answers, currentGame
  // 2.
  // 3. From judge's app   ->  Pick a question, set in DB
  // 4. forEach players  ->  Pick 7 cards that haven't been dealt (set in DB when they're drawn)
  // 5.

  componentDidMount() {
    if (!this.state.currentGame) {
      this.setGameForFirstTime();
    } else {
      // Listen for changes in DB for specific game
      this.listenForDbChanges();
    }
  }

  componentDidUpdate() {
    this.db.ref(`games`).on('value', snapshot => {
      const snap = snapshot.val();

      // If game has ended, redirect players to the dashboard
      if (!snap || (snap && !Object.keys(snap).includes(this.currentGameId))) {
        this.setState({
          showSpinner: true
        })
        this.redirectToDashboard();
      }

      // If the number of answers in the DB has changed, set the new array of answers to state 
      // if (snap && this.state.answers && (snap[this.currentGameId].cards.answers.length !== this.state.answers.length)) {
      //   this.setState({
      //     answers: snap[this.currentGameId].answers
      //   })
      // }
    });
  }

  setGameForFirstTime = () => {
    this.setState({
      showSpinner: true
    })
    this.db.ref(`games/${this.currentGameId}`).once('value', snapshot => {
      const snap = snapshot.val();
      const answers = snap.cards.answers.filter(deck => Object.keys(deck)[0] === this.props.player);

      if (snap) {
        // const allPlayersHaveCards = this.allPlayersHaveCards(Object.values(snap.players));

        // 1. Set in state: questions, answers, currentGame
        this.setState({
          answers: Object.values(answers[0])[0],
          currentGame: snap,
          judge: snap.judge,
          thisPlayer: this.props.player,
          players: snap.players, // This is an object! Player names are keys
          questions: questions.concat(questionsExp),
          round: 1,
          showSpinner: false
        });

        // If the player is the judge, pick a question
        if (this.playerIsJudge() && !snap.currentQuestion) {
          this.pickOneQuestion();
        } else {
          this.db.ref(`games/${this.currentGameId}`).on('value', snapshot => {
            this.setState({
              questions: snapshot.val().cards.questions,
              currentQuestion: snapshot.val().currentQuestion,
              answersRequired: snapshot.val().answersRequired
            });
          });
        }

        // If the player is the judge, pick cards for everybody
        // if (this.playerIsJudge() && !allPlayersHaveCards) {
        //   let cards;
        //   for (const p in snap.players) {
        //     if (!snap.players.cards) {
        //       cards = this.pickRandomAnswerCards(p);
        //       this.db.ref(`games/${this.currentGameId}/players/${p}`).update({
        //         cards,
        //       });
        //     }
        //   }
        //   this.db.ref(`games/${this.currentGameId}/cards/answers`).update(this.state.answers);
        // } else {
        //   this.db.ref(`games/${this.currentGameId}`).on('value', snapshot => {
        //     this.setState({
        //       answerCards: snapshot.val().players[this.props.player].cards,
        //       wins: snapshot.val().players[this.props.player].wins,
        //     });
        //   });
        // }
      }
    });

    this.setState({
      gameHasBeenSet: true
    });
  }

  allPlayersHaveCards = (playersArray) => {
    return playersArray.every(player => !!player.cards);
  }

  playerIsJudge = () => {
    return this.props.player === this.state.judge;
  }

  listenForDbChanges = () => {
    console.log('listening for changes')
    this.db.ref(`games/${this.currentGameId}`).on('value', snapshot => {
      console.log('Value changed for game ' + this.currentGameId);
    });
  }

  pickOneQuestion = () => {
    if (this.state.questions.length) {
      let index = getRandomNumber(this.state.questions.length);
      const newQuestionsArray = [...this.state.questions];
      const q = newQuestionsArray[index];
      newQuestionsArray.splice(index, 1);
      console.log('cards required', q.requiresCards)
      this.setState({
        answersRequired: q.requiresCards,
        currentQuestion: q.content,
        questions: newQuestionsArray
      });
      this.db.ref(`games/${this.currentGameId}/currentQuestion`).set(q.content);
      this.db.ref(`games/${this.currentGameId}/answersRequired`).set(q.requiresCards);
      this.db.ref(`games/${this.currentGameId}/cards/questions`).set(newQuestionsArray);
    } else {
      console.log('Game over!');
      this.setState({
        gameOver: true
      })
    }
  }

  // pickRandomAnswerCards = (player) => {
  //   let answerCards = [];
  //   for (let i = 0; answerCards.length < 7; i++) {
  //     const a = this.pickOneAnswer(player);
  //     if (a) {
  //       answerCards.push(a);
  //     }
  //   }
  //   if (this.state.thisPlayer === player) {
  //     this.setState({
  //       answerCards
  //     });
  //   }
  //   return answerCards;
  // }

  // pickOneAnswer = (player) => {
  //   let index = getRandomNumber(this.state.answers.length);
  //   const newAnswersArray = [...this.state.answers];
  //   const card = newAnswersArray[index];
  //   newAnswersArray.splice(index, 1);
  //   this.setState({
  //     answers: newAnswersArray
  //   })
  //   card.owner = player;
  //   return card;
  // }

  endGame = () => {
    this.db.ref(`/games/${this.state.currentGame.gameId}`).remove();
    this.redirectToDashboard()
  }

  redirectToDashboard = () => {
    this.props.history.push('/dashboard');
  }

  handlePlayCard = (answers, card) => {
    // Set the owner property to know who played the card
    card.owner = this.props.player;
    // Remove the card from the answers deck and set to state
    const newAnswers = answers.filter(a => a.id !== card.id);
    this.setState({
      answers: newAnswers
    })
    console.log(card);
  }

  render() {
    return (
      (
        this.state.gameHasBeenSet
        && this.state.answers
        && this.state.questions
        &&
        <div id='game-container'>
          <Navbar
            players={this.state.players}
            answersLeft={this.state.answers.length}
            questionsLeft={this.state.questions.length}
          />
          {
            !this.state.showSpinner
              ? <>
                <h1 className='page-title'>
                  {
                    this.props.match.params.gameId
                      ? `Partida ${this.props.match.params.gameId}`
                      : null
                  }
                </h1>
                {
                  !this.state.errorNoGameIdFound && !this.state.showSpinner &&
                  <button onClick={this.endGame}>Terminar</button>
                }
                {
                  !!this.state.questions.length
                  && !this.state.errorNoGameIdFound
                  && !!this.state.currentQuestion
                  &&
                  <PlayArea question={this.state.currentQuestion} />
                }
                {
                  !!this.state.answers
                    && !!this.state.currentQuestion
                    && this.state.answersRequired
                    ? !this.playerIsJudge()
                      ? <CardsArea
                        answers={this.state.answers}
                        handlePlayCard={this.handlePlayCard}
                        answersRequired={this.state.answersRequired}
                      />
                      : <JudgeArea playedCards={
                        [
                          { content: 'Tomar sopa en Diciembre' },
                          { content: 'La cancion de colchones Cannon sonando ininterrumpidamente por el resto de la eternidad' },
                          { content: 'Que Argentina gane el Mundial' },
                          { content: 'Pasos de baile' }
                        ]
                      }
                      />
                    : null
                }
              </>
              : <Spinner styleImg={{ marginTop: '3rem' }} width='100px' height='100px' />
          }
        </div>
      )
    );
  }
}

export default withRouter(Game);