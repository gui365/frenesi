import React, { Component } from 'react';
import AppRouter from './router/AppRouter';
import Footer from './components/Footer';
import { fire } from './fire';
import { shuffle } from './utils/utils';
import answers from './data/cardsAnswers';
import answersExp from './data/cardsAnswersExp01';
import answersExp2 from './data/cardsAnswersExp02';
import questions from './data/cardsQuestions';
import questionsExp from './data/cardsQuestionsExp01';
import questionsExp2 from './data/cardsQuestionsExp02';

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
          answers: shuffle(this.filterOutDisabledCards(answers)
            .concat(
              this.filterOutDisabledCards(answersExp),
              this.filterOutDisabledCards(answersExp2)
            )
          ),
          questions: shuffle(this.filterOutDisabledCards(questions)
            .concat(
              this.filterOutDisabledCards(questionsExp),
              this.filterOutDisabledCards(questionsExp2)
            )
          )
        }
      })
    }, 1000);
  }

  filterOutDisabledCards(arr) {
    return arr.filter(item => item.isEnabled);
  }

  render() {
    return (
      <div style={{ boxSizing: 'border-box', height: '100vh' }}>
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
