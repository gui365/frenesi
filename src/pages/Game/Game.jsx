import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PlayArea from '../../components/PlayArea/PlayArea';
import CardsArea from '../../components/CardsArea/CardsArea';
import Spinner from '../../components/Spinner/Spinner';
import answers from '../../data/cardsAnswers';
import answersExp from '../../data/cardsAnswersExp01';
import questions from '../../data/cardsQuestions';
import questionsExp from '../../data/cardsQuestionsExp01';
import { fire } from '../../fire';
import './Game.scss';

class Game extends Component {
  state = {
    questions: [],
    answers: [],
    currentGame: null,
    gamesList: [],
    errorNoGameIdFound: false
  }

  db = fire.database();

  // componentWillMount() {
  //   this.setState({
  //     answers: answers.concat(answersExp),
  //     questions: questions.concat(questionsExp),
  //   });
  //   // this.db.ref('cards/answers').set(answers.concat(answersExp));
  //   // this.db.ref('cards/questions').set(questions.concat(questionsExp));
  // }

  componentDidMount() {
    const currentGameId = this.props.match.params.gameId;
    this.setState({
      showSpinner: true
    })
    this.db.ref(`games`).on('value', snapshot => {
      console.log('snapshot', snapshot)
      if (snapshot.val() && Object.keys(snapshot.val()).indexOf(currentGameId) !== -1) {
        this.setState({
          showSpinner: false,
          gamesList: snapshot.val(),
          currentGame: snapshot.val()[currentGameId],
          answers: answers.concat(answersExp),
          questions: questions.concat(questionsExp)
        });
      } else {
        this.setState({
          errorNoGameIdFound: true,
          showSpinner: false,
        })
      }
    });
    // this.db.ref('cards/answers').on('value', snapshot => {
    //   this.setState({
    //     answers: snapshot.val(),
    //   });
    // });

    //   this.db.ref('cards/questions').on('value', snapshot => {
    //     const answers = this.pickRandomAnswerCards();
    //     this.setState({
    //       cardsAnswers: answers,
    //       questions: snapshot.val(),
    //     });
    //   });
  }

  pickOneQuestion = () => {
    if (this.state.questions.length) {
      const q = this.state.questions[Math.floor(Math.random() * this.state.questions.length)];
      if (q && !q.drawn) {
        return q.content;
      } else {
        this.pickOneQuestion();
      }
    } else {
      console.log('Game over!');
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
    // console.log(answers);
    return answers;
  }

  pickOneAnswer = () => {
    let answer = this.state.answers[Math.floor(Math.random() * this.state.answers.length)];
    if (answer && !answer.drawn) {
      answer.drawn = true;
      return answer;
    } else {
      this.pickOneAnswer();
    }
  }

  endGame = () => {
    this.db.ref(`/games/${this.state.currentGame.gameId}`).remove();
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <div id='container'>
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
          !!this.state.questions.length && !this.state.errorNoGameIdFound &&
          <>
            <PlayArea question={this.pickOneQuestion()} />
            <CardsArea answers={this.pickRandomAnswerCards()} />
          </>
        }
        {
          this.state.errorNoGameIdFound &&
          <div id='error-message'>No hay ninguna partida con este codigo. Volve al <Link className='link' to='/dashboard'>Menu</Link> para crear una.</div>
        }
        {
          this.state.showSpinner &&
          <Spinner width='100px' height='100px' />
        }
      </div>
    );
  }
}

export default withRouter(Game);