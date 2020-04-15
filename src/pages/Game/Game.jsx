import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PlayArea from '../../components/PlayArea/PlayArea';
import CardsArea from '../../components/CardsArea/CardsArea';
import answers from '../../data/cardsAnswers';
import answersExp from '../../data/cardsAnswersExp01';
import questions from '../../data/cardsQuestions';
import questionsExp from '../../data/cardsQuestionsExp01';
import { fire } from '../../fire';

class Game extends Component {
  state = {
    questions: [],
    answers: [],
    currentGame: null
  }
  
  db = fire.database();

  componentWillMount() {
    this.setState({
      answers: answers.concat(answersExp),
      questions: questions.concat(questionsExp),
    });

    const currentGameId = this.props.match.params.gameId;
    console.log(currentGameId)
    this.db.ref(`games/${currentGameId}`).on('value', snapshot => {
      // console.log(snapshot.val())
      // const currentGame = snapshot.val().games[currentGameId];
      // this.setState({
      //   currentGame
      // });
    });

    // this.db.ref('cards/answers').set(answers.concat(answersExp));
    // this.db.ref('cards/questions').set(questions.concat(questionsExp));
  }

  componentDidMount() {
   
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

  render() {
    return (
      <div id='container'>
        <Navbar />
        {
          !!this.state.questions.length &&
          <>
            <PlayArea question={this.pickOneQuestion()} />
            <CardsArea answers={this.pickRandomAnswerCards()} />
            <button >Terminar</button>
          </>
        }
      </div>
    );
  }
}

// export default withRouter(Game);
export default Game;