import React, { Component } from 'react';
import './Admin.scss';
import Signup from '../../components/Signup';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

class Admin extends Component {
  state = {
    section: ''
  }

  sectionTitleClasses = 'admin-section-title d-flex a-center j-between px-1rem';

  // componentWillMount() {
  //   this.setState({
  //     answers: answers.concat(answersExp),
  //     questions: questions.concat(questionsExp),
  //   });
  //   // this.db.ref('cards/answers').set(answers.concat(answersExp));
  //   // this.db.ref('cards/questions').set(questions.concat(questionsExp));
  // }

  // componentDidMount() {
  //   this.db.ref('cards/answers').on('value', snapshot => {
  //     this.setState({
  //       answers: snapshot.val(),
  //     });
  //   });

  //   this.db.ref('cards/questions').on('value', snapshot => {
  //     const answers = this.pickRandomAnswerCards();
  //     this.setState({
  //       cardsAnswers: answers,
  //       questions: snapshot.val(),
  //     });
  //   });
  // }

  handleNavClick = (event) => {
    const section = event.target.getAttribute('name');
    const currentState = this.state.section;

    this.setState({
      section: currentState === section ? '' : section
    });
  }

  render() {
    return (
      <main id='admin-container' className='align-center'>
        <Logo />
        <h1 className='bold m-b-1rem'>Admin Portal</h1>
        <div id='admin-container-options'>
          <div name='signup'
            className={this.sectionTitleClasses}
            onClick={this.handleNavClick}>
            <span name='signup'>Create a new user</span>
            <Button
              name='signup'
              icon={this.state.section === 'signup' ? 'collapse' : 'expand'}
              imageProps={{ name: 'signup' }}
            />
          </div>
          {
            this.state.section === 'signup' &&
            < section >
              <Signup />
            </section>
          }
          <div name='setQA'
            className={this.sectionTitleClasses}
            onClick={this.handleNavClick}>
            <span name='setQA'>Set Q&amp;A in DB</span>
            <Button
              name='setQA'
              icon={this.state.section === 'setQA' ? 'collapse' : 'expand'}
              imageProps={{ name: 'setQA' }}
            />
          </div>
          {
            this.state.section === 'setQA' &&
            < section >
              <p>Set QA</p>
            </section>
          }
        </div>
      </main >
    );
  }
}

export default Admin;
