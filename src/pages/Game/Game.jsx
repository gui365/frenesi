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
import { ModalType } from '../../constants/modalType';
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
    gameWinner: [],
    playedCards: [],
    players: null,
    questions: [],
    round: null,
    showSpinner: false,
    showWinnerModal: null,
    thisPlayer: ''
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
            answersRequired: null,
            currentQuestion: null,
            currentAnswers: [],
            players: thisGameData.players,
            questions: thisGameData.cards.questions,
            showWinnerModal: thisGameData.winner,
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
                winnerCardContent: null,
                showLoadingModal: true
              });

              this.db.ref(`games/${this.currentGameId}/readyForNextRound`).on('value', snapshot => {
                const snap = snapshot.val();
                let hasAlreadyPushedToArray = false;

                if (snap) {
                  for (let i = 0; i < Object.values(snap).length; i++) {
                    if (Object.keys(Object.values(snap)[i])[0] === this.props.player) {
                      hasAlreadyPushedToArray = true;
                    }
                  }
                }

                if (!snap || (snap && !hasAlreadyPushedToArray)) {
                  this.db.ref(`games/${this.currentGameId}/readyForNextRound`).push({
                    [this.props.player]: true
                  });
                }

                if (snap) {
                  const allPlayersReadyForNextRound = Object.values(snap).length === Object.values(this.state.players).length;

                  if (allPlayersReadyForNextRound) {
                    this.setState({
                      showLoadingModal: false
                    });

                    this.db.ref(`games/${this.currentGameId}/readyForNextRound`).off();
                  }
                }
              });
            }
          }, 5000);

          this.db.ref(`games/${this.currentGameId}/readyForNextRound`).set(null);
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
        const answers = snap.cards.answers[this.props.player];

        if (snap) {
          // const allPlayersHaveCards = this.allPlayersHaveCards(Object.values(snap.players));

          // 1. Set in state: questions, answers, currentGame
          this.setState({
            answers,
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
      this.setState({
        answersRequired: q.requiresCards,
        currentQuestion: q.content,
        questions: newQuestionsArray
      });
      this.db.ref(`games/${this.currentGameId}/currentQuestion`).set(q.content);
      this.db.ref(`games/${this.currentGameId}/answersRequired`).set(q.requiresCards);
      this.db.ref(`games/${this.currentGameId}/cards/questions`).set(newQuestionsArray);
    } else {
      this.gameOver();
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

  handlePlayCard = (answersArray, cardObj) => {
    let newAnswers;
    let newCurrentAnswers = Object.entries(this.state.currentAnswers);
    let cardContent;
    let cardOwner = cardObj[0].owner;

    if (this.state.answersRequired === 1) {
      // Remove the card from the answers deck and set to state
      newAnswers = answersArray.filter(a => a.id !== cardObj[0].id);
      cardContent = cardObj[0].content;
    } else {
      newAnswers = answersArray.filter(a => a.id !== cardObj[0].id && a.id !== cardObj[1].id);
      cardContent = ` 1️⃣ ${cardObj[0].content} \r\n\r\n 2️⃣ ${cardObj[1].content}`;
    }

    this.setState({
      answers: newAnswers,
      currentAnswers: newCurrentAnswers.push({
        content: cardContent,
        owner: cardOwner
      })
    });

    this.db.ref(`/games/${this.state.currentGame.gameId}/currentAnswers`).push({
      content: cardContent,
      owner: cardOwner
    });

    this.db.ref(`/games/${this.state.currentGame.gameId}/cards/answers`).update({
      [this.props.player]: newAnswers
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

  hasPlayerPlayed = () => {
    return Object.values(this.state.currentAnswers).some(answer => answer.owner === this.props.player);
  }

  getPlayedCardContent = () => {
    return Object.values(this.state.currentAnswers).find(answer => answer.owner === this.props.player);
  }

  gameOver = () => {
    const winners = [];
    const players = Object.values(this.state.players);

    players.forEach(p => {
      if (winners.length === 0 || p.wins > winners[0].wins) {
        winners.shift();
        winners.push(p);
      } else if (p.wins === winners[0].wins) {
        winners.push(p);
      }
    });

    this.setState({
      gameOver: true,
      gameWinner: winners
    });

    // setTimeout(() => {
    //   this.endGame();
    // }, 10000);
  }

  render() {
    return (
      (
        this.state.gameHasBeenSet
        && this.state.answers
        && this.state.questions
        &&
        // ?
        // (
          // !this.state.gameOver
            // ?
             <div id='game-container'>
              {
                !!this.state.showWinnerModal &&
                <Modal
                  modalType={ModalType.WINNER}
                  winner={this.state.showWinnerModal}
                  winnerCardContent={this.state.winnerCardContent}
                />
              }
              {
                this.state.showLoadingModal &&
                <Modal
                  modalType={ModalType.LOADING}
                />
              }
              <Navbar
                judge={this.state.judge}
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
                      <div className='end-game-div'>
                        <button id='end-game-button' onClick={this.endGame}>Terminar</button>
                      </div>
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
                        && !this.state.showWinnerModal
                        && !this.state.showLoadingModal
                        ? !this.playerIsJudge()
                          ? !this.hasPlayerPlayed()
                            ? <CardsArea
                              answers={this.state.answers}
                              handlePlayCard={this.handlePlayCard}
                              answersRequired={this.state.answersRequired}
                            />
                            : (
                              <div id='cardsarea'>
                                <p className="message-large"><span className="bold">Jugaste:</span> {this.getPlayedCardContent().content}</p>
                                {
                                  Object.entries(this.state.currentAnswers).length === Object.entries(this.state.players).length - 1
                                    ? <JudgeArea
                                      isJudge={this.playerIsJudge()}
                                      playedCards={this.state.currentAnswers}
                                      players={this.state.players}
                                    />
                                    : <p className="message-large bold">Esperando a que todos jueguen</p>
                                }
                              </div>
                            )
                          : <JudgeArea
                            isJudge={this.playerIsJudge()}
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
        //     : <Modal
        //       modalType={ModalType.GAMEOVER}
        //       gameWinner={this.state.gameWinner}
        //     />
        // )
        // : <div></div>
      )
    );
  }
}

export default withRouter(Game);