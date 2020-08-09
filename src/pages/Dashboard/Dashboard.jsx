import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Dashboard.scss';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import GamesTable from '../../components/GamesTable';
import { fire } from '../../fire';
import { getRandomNumber, shuffle } from '../../utils/utils';

class Dashboard extends Component {
  state = {
    answers: this.props.cards,
    currentGameId: '',
    gameListArray: [],
    maxGameNumber: 0,
    showSpinner: false,
    userHasJoined: false
  }

  user = JSON.parse(sessionStorage.getItem('user'));
  db = fire.database();

  componentDidMount() {
    this.setState({
      showSpinner: true
    });

    this.db.ref('games').on('value', snapshot => {
      const snap = snapshot.val();
      const objToArray = [];
      for (const key in snap) {
        if (snap.hasOwnProperty(key)) {
          objToArray.push(snap[key]);
        }
      }

      this.setState({
        gameListObject: snap,
        gameListArray: objToArray,
        maxGameNumber: objToArray.length,
        showSpinner: false
      })

      if (snap && this.state.currentGameId && this.state.userHasJoined) {
        if (snap[this.state.currentGameId] && snap[this.state.currentGameId]['gameHasStarted'] === true) {
          const history = this.props.history;
          if (history) {
            history.push(`/game/${this.state.currentGameId}`);
          }
        }
      }
    });
  }

  generateUniqueId = () => {
    const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = letter[getRandomNumber(letter.length)];

    for (let i = 0; i < 4; i++) {
      id += getRandomNumber(10);
    }
    return id;
  }

  createGame = () => {
    const id = this.generateUniqueId();
    this.db.ref(`games/${id}`).set({
      cards: this.props.cards,
      createdBy: this.user.displayName ? this.user.displayName : this.user.email,
      createdOn: (new Date()).toLocaleDateString(),
      gameHasStarted: false,
      gameId: id,
      judge: ''
    });
  }

  joinGame = (id) => {
    this.db.ref(`games/${id}/players/${this.user.displayName}`).update({
      ...this.user,
      wins: 0
    });
    this.setState({
      userHasJoined: true,
      currentGameId: id
    });
  }

  deleteGame = (id) => {
    this.db.ref(`games/${id}`).remove();
  }

  removePlayer = (id) => {
    this.db.ref(`games/${id}/players/${this.user.displayName}`).remove();
    this.setState({
      userHasJoined: false,
      currentGameId: ''
    });
  }

  startGame = () => {
    const { gameListObject, currentGameId } = this.state;
    const currentGamePlayers = Object.keys(gameListObject[currentGameId].players);

    // IF at least 3 players have joined the game, continue to next step
    if (currentGamePlayers.length >= 2) {
      let startingIndex = 0;
      const numCardsPerPlayer = Math.floor(this.state.answers.answers.length / currentGamePlayers.length);
      const arrCardsperPlayer = {};
      const shuffledArray = shuffle(shuffle(this.state.answers.answers));

      currentGamePlayers.forEach(player => {
        const deck = shuffledArray.slice(startingIndex, startingIndex + numCardsPerPlayer);
        arrCardsperPlayer[player] = deck.map(card => { return { ...card, owner: player } });
        startingIndex = startingIndex + numCardsPerPlayer;
      });

      // Select a judge, set in DB before history.push
      this.db.ref(`games/${this.state.currentGameId}`).update({
        gameHasStarted: true,
        judge: currentGamePlayers[0],
        round: 1
      });

      this.db.ref(`games/${this.state.currentGameId}/cards`).update({
        answers: arrCardsperPlayer
      });
    } else {
      // OTHERWISE set notEnoughPlayersError to true and show error
      this.setState({
        notEnoughPlayersError: true
      });
      // And set it back to false after 3 seconds to hide the error
      setTimeout(() => {
        this.setState({
          notEnoughPlayersError: false
        })
      }, 3000);
    }
  }

  render() {
    return (
      <div id='container' >
        <Navbar optionLogout={true} />
        {/* <h1 className='page-title'>{`userJoined ${userHasJoined} gameId ${this.state.currentGameId}`}</h1> */}
        <h1 className='page-title' >Menu</h1>
        <main id='dashboard-content'>
          <section id='menu-options'>
            <Button
              icon='new'
              className='menu-options-btn'
              content='Nueva partida'
              clickHandler={this.createGame}
              isDisabled={this.maxGameNumber === 3}
            />
            {/* <Button
              icon='join'
              className='menu-options-btn'
              content='Unirse'
              clickHandler={() => { console.log('unirse') }}
            /> */}
          </section>
          <section id='menu-games-table'>
            <GamesTable
              currentGameId={this.state.currentGameId}
              deleteGame={this.deleteGame}
              gameListArray={this.state.gameListArray}
              joinGame={this.joinGame}
              notEnoughPlayersError={this.state.notEnoughPlayersError}
              removePlayer={this.removePlayer}
              showSpinner={this.state.showSpinner}
              startGame={this.startGame}
              userHasJoined={this.state.userHasJoined}
              user={this.user}
            />
          </section>
        </main>
      </div >
    );
  }
}

export default withRouter(Dashboard);
