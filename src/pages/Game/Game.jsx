import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PlayArea from '../../components/PlayArea/PlayArea';
import CardsArea from '../../components/CardsArea/CardsArea';
import Spinner from '../../components/Spinner/Spinner';
import answers from '../../data/cardsAnswers';
import answersExp from '../../data/cardsAnswersExp01';
import questions from '../../data/cardsQuestions';
import questionsExp from '../../data/cardsQuestionsExp01';
import { getRandomNumber } from '../../utils/utils';
import { fire } from '../../fire';
import './Game.scss';

class Game extends Component {
  state = {
    answers: [],
    answerCards: [],
    currentGame: null,
    errorNoGameIdFound: false,
    gameHasBeenSet: false,
    gameOver: false,
    players: [],
    questions: [],
    round: 1,
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
    });
  }

  setGameForFirstTime = () => {
    this.setState({
      showSpinner: true
    })
    this.db.ref(`games/${this.currentGameId}`).once('value', snapshot => {
      const snap = snapshot.val();

      if (snap) {
        const allPlayersHaveCards = this.allPlayersHaveCards(Object.values(snap.players));
        // 1. Set in state: questions, answers, currentGame
        this.setState({
          answers: answers.concat(answersExp),
          currentGame: snap,
          judge: snap.judge,
          thisPlayer: this.props.player,
          currentQuestion: snap.currentQuestion,
          players: snap.players, // This is an object! Player names are keys
          questions: questions.concat(questionsExp),
          showSpinner: false
        });

        // If the player is the judge, pick a question
        if (this.props.player === snap.judge && !this.state.currentQuestion) {
          this.pickOneQuestion();
        } else {
          this.db.ref(`games/${this.currentGameId}/currentQuestion`).on('value', snapshot => {
            this.setState({
              currentQuestion: snapshot.val()
            });
          });
        }

        // If the player is the judge, pick cards for everybody
        if (this.props.player === snap.judge && !allPlayersHaveCards) {
          let cards;
          for (const p in snap.players) {
            if (!snap.players.cards) {
              cards = this.pickRandomAnswerCards(p);
              // console.log('Cards for ', p, cards);
              this.db.ref(`games/${this.currentGameId}/players/${p}/cards`).set(cards);
            }
          }
        } else {
          this.db.ref(`games/${this.currentGameId}/players/${this.props.player}/cards`).on('value', snapshot => {
            this.setState({
              answerCards: snapshot.val()
            });
          });
        }
      }
    });

    this.setState({
      gameHasBeenSet: true
    });
  }

  allPlayersHaveCards = (playersArray) => {
    return playersArray.every(player => !!player.cards);
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
      newQuestionsArray.splice(index, 1)
      this.setState({
        currentQuestion: q.content,
        questions: newQuestionsArray
      });
      this.db.ref(`games/${this.currentGameId}/currentQuestion`).set(q.content);
    } else {
      console.log('Game over!');
      this.setState({
        gameOver: true
      })
    }
  }

  pickRandomAnswerCards = (player) => {
    let answerCards = [];
    for (let i = 0; answerCards.length < 7; i++) {
      const a = this.pickOneAnswer();
      if (a) {
        answerCards.push(a);
      }
    }
    if (this.state.thisPlayer === player) {
      this.setState({
        answerCards
      });
    }
    return answerCards;
  }

  pickOneAnswer = () => {
    let index = getRandomNumber(this.state.answers.length);
    const newAnswersArray = [...this.state.answers];
    const card = newAnswersArray[index];
    newAnswersArray.splice(index, 1);
    this.setState({
      answers: newAnswersArray
    })
    return card;
  }

  endGame = () => {
    this.db.ref(`/games/${this.state.currentGame.gameId}`).remove();
    this.redirectToDashboard()
  }

  redirectToDashboard = () => {
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      (
        this.state.gameHasBeenSet &&
        <div id='game-container'>
          <Navbar />
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
                  !!this.state.answerCards &&
                  <CardsArea answers={this.state.answerCards} />
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