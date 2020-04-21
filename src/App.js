import React, { Component } from 'react';
import AppRouter from './router/AppRouter';
import Footer from './components/Footer';
import { fire } from './fire';
import answers from './data/cardsAnswers';
import answersExp from './data/cardsAnswersExp01';
import questions from './data/cardsQuestions';
import questionsExp from './data/cardsQuestionsExp01';

class App extends Component {
  state = {
    cards: ''
  }

  db = fire.database();

  componentDidMount() {
    // this.db.ref('cards').on('value', snap => {
    //   this.setState({
    //     cards: snap.val()
    //   })
    // });
    setTimeout(() => {
      this.setState({
        cards: {
          answers: answers.concat(answersExp),
          questions: questions.concat(questionsExp),
        }
      })
    }, 1000);
  }

  render() {
    return (
      <div style={{ boxSizing: 'border-box', height:'100vh' }}>
        <AppRouter cards={this.state.cards} />
        {
          window.location.pathname.includes('dashboard') &&
          <Footer />
        }
      </div>
    );
  }
}

export default App;
