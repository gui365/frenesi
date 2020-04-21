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
    currentGame: null,
    errorNoGameIdFound: false,
    gameOver: false,
    players: [],
    questions: [],
    round: 1,
    showSpinner: false,
    thisPlayer: ''
  }

  currentGameId = this.props.match.params.gameId
  db = fire.database();

  // 3. From judge's app   ->  Pick a question, set in DB
  // 4. forEach players  ->  Pick 7 cards that haven't been dealt (set in DB when they're drawn)
  // 5.

  // ***   SUBSEQUENT ROUNDS   ***
  // 1. Pick a judge       ->  Set judge in the DB
  // 2. From judge's app   ->  Pick a question, set in DB
  // 3. 

  componentDidMount() {
    console.log('componentDidMount');
    console.log(!!this.state.currentGame);
    if (!this.state.currentGame) {
      // *** FIRST TIME GAME LOADS ***
      console.log('componentDidMount, setting state for first time');
      this.setGameForFirstTime();
    } else {
      // Listen for changes in DB for specific game
      console.log('componentDidMount, setting state AFTER first time')
      this.listenForDbChanges();
    }
  }

  setGameForFirstTime = () => {
    console.log('*** SETTING STATE FOR THE FIRST TIME ***');
    this.setState({
      showSpinner: true
    })
    this.db.ref(`games/${this.currentGameId}`).on('value', snapshot => {
      const snap = snapshot.val();
      if (snap) {
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
        if (!this.state.currentQuestion) {
          this.pickOneQuestion();
        }
      } else {
        this.setState({
          errorNoGameIdFound: true,
          showSpinner: false,
        });
      }
    });
  }

  listenForDbChanges = () => {
    console.log('listening for changes')
    this.db.ref(`games/${this.currentGameId}`).on('value', snapshot => {
      console.log('Value changed for game ' + this.currentGameId);
    });
  }

  pickOneQuestion = () => {
    // console.log('*** PICKING ONE QUESTION ***');
    if (this.state.questions.length) {
      // console.log('THIS PLAYER IS THE JUDGE', this.state.thisPlayer === this.state.judge);
      if (this.state.thisPlayer === this.state.judge) {
        let index = getRandomNumber(this.state.questions.length);
        const newQuestionsArray = [...this.state.questions];
        const q = newQuestionsArray[index];
        if (q && !q.drawn) {
          // set newQuestionsArray to state
          this.setState({
            currentQuestion: q.content
          });
          this.db.ref(`games/${this.currentGameId}/currentQuestion`).update({ value: q.content });
        } else {
          this.pickOneQuestion();
        }
      } else {
        this.db.ref(`games/${this.currentGameId}/currentQuestion`).on('value', snap => {
          this.setState({
            currentQuestion: snap.val()
          })
        });
      }
    } else {
      this.setState({
        gameOver: true
      })
    }
  }

  pickRandomAnswerCards = () => {
    let answers = [];
    for (let i = 0; answers.length < 7; i++) {
      const a = this.pickOneAnswer();
      if (a) {
        answers.push(a);
      }
    }
    return answers;
  }

  pickOneAnswer = () => {
    let answer = this.state.answers[getRandomNumber(this.state.answers.length)];
    if (answer && !answer.drawn) {
      answer.drawn = true;
      return answer;
    } else {
      this.pickOneAnswer();
    }
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
      <div id='game-container'>
        <Navbar />
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
          !!this.state.questions.length && !this.state.errorNoGameIdFound && !!this.state.currentQuestion &&
          <>
            <PlayArea question={this.state.currentQuestion.value} />
            <CardsArea answers={this.pickRandomAnswerCards()} />
          </>
        }
        {
          this.state.errorNoGameIdFound &&
          this.redirectToDashboard()
        }
        {
          this.state.showSpinner &&
          <Spinner styleImg={{ marginTop: '3rem' }} width='100px' height='100px' />
        }
      </div>
    );
  }
}

export default withRouter(Game);