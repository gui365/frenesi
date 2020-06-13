import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PlayArea from '../../components/PlayArea/PlayArea';
import CardsArea from '../../components/CardsArea/CardsArea';
import JudgeArea from '../../components/JudgeArea/JudgeArea';
import Spinner from '../../components/Spinner/Spinner';
import Modal from '../../components/Modal/Modal';
import { getRandomNumber } from '../../utils/utils';
import { fire } from '../../fire';
import './Game.scss';

class Game extends Component {
  state = {
    answers: [],
    answersRequired: null,
    currentAnswers: [],
    currentGame: null,
    errorNoGameIdFound: false,
    gameHasBeenSet: false,
    gameOver: false,
    playedCards: [],
    players: null,
    questions: [],
    round: null,
    showSpinner: false,
    showWinnerModal: null,
    thisPlayer: '',
  }

  currentGameId = this.props.match.params.gameId
  db = fire.database();

  componentDidMount() {
    if (!this.state.currentGame) {
      this.db.ref(`games`).on('value', snapshot => {
        const snap = snapshot.val();
        if (snap && Object.keys(snap).includes(this.currentGameId)) {
          this.setGameForFirstTime();
        } else {
          // TODO: this is not working
          this.redirectToDashboard();
        }
      });
    }
  }

  componentWillUpdate() {
    this.db.ref(`games`).once('value', snapshot => {
      if (snapshot.val()) {
        const snap = snapshot.val();
        const thisGameData = snap[this.currentGameId];

        // **************************
        // *  UPDATE PLAYED ANSWERS *
        // **************************
        if (!!thisGameData.currentAnswers &&
          Object.values(this.state.currentAnswers).length !== Object.values(thisGameData.currentAnswers).length) {
          this.setState({
            currentAnswers: thisGameData.currentAnswers
          })
        }

        if (this.state.currentQuestion !== thisGameData.currentQuestion) {
          this.setState({
            currentQuestion: thisGameData.currentQuestion
          })
        }

        // **************************
        // ******* RESET GAME *******
        // **************************
        // If there is a winner in the DB, display the winner modal
        if (!this.state.showWinnerModal && !!thisGameData.winner) {
          const winnerCardContent = Object.values(this.state.currentAnswers).map(card => {
            let cardContent;
            if (card.owner === thisGameData.winner) {
              cardContent = card.content;
            }
            return cardContent;
          })
          
          this.setState({
            players: thisGameData.players,
            showWinnerModal: thisGameData.winner,
            currentQuestion: null,
            currentAnswers: [],
            winnerCardContent
          });

          setTimeout(() => {
            if (!!thisGameData.winner) {
              // Reset the winner (set to null)
              this.db.ref(`games/${this.currentGameId}/winner`).set(null);
              this.db.ref(`games/${this.currentGameId}/round`).set(this.state.round + 1);

              // Reset the currentAnswers (set to null)
              if (!!thisGameData.currentAnswers) {
                this.db.ref(`games/${this.currentGameId}/currentAnswers`).remove();
              }

              // Pick another judge only if it hasn't been picked yet
              if (this.state.judge === thisGameData.judge) {
                const newJudge = this.pickAnotherJudge();
                this.db.ref(`games/${this.currentGameId}/judge`).set(newJudge);
                this.setState({
                  judge: newJudge
                });

                if (this.props.player === thisGameData.judge) {
                  // Pick a new question
                  this.pickOneQuestion();
                }
              }

              // Get rid of the modal showing the winner
              this.setState({
                showWinnerModal: null,
                currentAnswers: [],
                round: this.state.round + 1,
                winnerCardContent: null
              });
            }
          }, 5000);
        }
      }
    });
  }

  setGameForFirstTime = () => {
    this.setState({
      showSpinner: true
    })
    if (!this.state.answers.length && !this.state.currentGame) {
      this.db.ref(`games/${this.currentGameId}`).once('value', snapshot => {
        const snap = snapshot.val();
        const answers = snap.cards.answers.filter(deck => Object.keys(deck)[0] === this.props.player);

        if (snap) {
          // const allPlayersHaveCards = this.allPlayersHaveCards(Object.values(snap.players));

          // 1. Set in state: questions, answers, currentGame
          this.setState({
            answers: Object.values(answers[0])[0],
            createdBy: snap.createdBy,
            currentGame: snap,
            judge: snap.judge,
            players: snap.players, // This is an object! Player names are keys
            questions: snap.cards.questions,
            round: 1,
            showSpinner: false,
            thisPlayer: this.props.player
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
        }
      });

      this.setState({
        gameHasBeenSet: true
      });
    } else {
      this.setState({
        showSpinner: false
      })
    }
  }

  allPlayersHaveCards = (playersArray) => {
    return playersArray.every(player => !!player.cards);
  }

  playerIsJudge = () => {
    return this.props.player === this.state.judge;
  }

  pickAnotherJudge = () => {
    const playersArray = Object.keys(this.state.players);
    let newJudge = playersArray[0];

    for (let i = 0; i < playersArray.length; i++) {
      if (this.state.judge === playersArray[i] && i + 1 !== playersArray.length) {
        newJudge = playersArray[i + 1];
      }
    }
    // console.log('New judge is ', newJudge)
    return newJudge;
  }

  pickOneQuestion = () => {
    if (this.state.questions.length) {
      let index = getRandomNumber(this.state.questions.length);
      const newQuestionsArray = [...this.state.questions];
      const q = newQuestionsArray[index];
      newQuestionsArray.splice(index, 1);
      // console.log('cards required', q.requiresCards)
      // console.log('card content', q.content)
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

  endGame = () => {
    this.db.ref(`/games/${this.state.currentGame.gameId}`).remove();
    this.redirectToDashboard()
  }

  redirectToDashboard = () => {
    console.log('Redirecting to Dashboard');
    this.props.history.push('/dashboard');
  }

  handlePlayCard = (answers, card) => {
    // TODO:
    // Handle play more than 1 answer card

    // Remove the card from the answers deck and set to state
    const newAnswers = answers.filter(a => a.id !== card.id);
    const newCurrentAnswers = Object.entries(this.state.currentAnswers);

    this.setState({
      answers: newAnswers,
      currentAnswers: newCurrentAnswers.push({
        content: card.content,
        owner: card.owner
      })
    });

    this.db.ref(`/games/${this.state.currentGame.gameId}/currentAnswers`).push({
      content: card.content,
      owner: card.owner
    });
  }

  handlePickWinner = card => {
    // Give the onwer of the card 1 point, set to state and DB
    const newPlayers = { ...this.state.players };

    for (const key in newPlayers) {
      if (key === card.owner) {
        newPlayers[key].wins++;
      }
    }

    this.setState({
      showWinnerModal: card.owner,
      players: newPlayers
    });

    this.db.ref(`/games/${this.state.currentGame.gameId}/players/${card.owner}`).update({
      wins: newPlayers[card.owner].wins
    });

    this.db.ref(`/games/${this.state.currentGame.gameId}/winner`).set(card.owner);

    // Reset game -> new judge, new question
  }

  render() {
    return (
      (
        this.state.gameHasBeenSet
        && this.state.answers
        && this.state.questions
        &&
        <div id='game-container'>
          {
            !!this.state.showWinnerModal &&
            <Modal
              winner={this.state.showWinnerModal}
              playedCards={Object.values(this.state.currentAnswers)}
              winnerCardContent={this.state.winnerCardContent}
            />
          }
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
                  !this.state.errorNoGameIdFound && !this.state.showSpinner && this.props.player === this.state.createdBy &&
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
                      : <JudgeArea
                        playedCards={this.state.currentAnswers}
                        players={this.state.players}
                        handlePickWinner={this.handlePickWinner}
                        showWinnerModal={this.state.showWinnerModal}
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