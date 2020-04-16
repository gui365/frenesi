import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Dashboard.scss';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import GamesTable from '../../components/GamesTable';
import { fire } from '../../fire';

class Dashboard extends Component {
  state = {
    maxGameNumber: 0,
    gameList: [],
    currentGameId: '',
    userHasJoined: false,
    showSpinner: false
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
        gameList: objToArray,
        maxGameNumber: objToArray.length,
        showSpinner: false
      })

      // alert(`SNAP ${!!snap} && CURRENTID ${!!currentGameId} && USERJOINED ${!!userHasJoined}`)
      if (snap && this.state.currentGameId && this.state.userHasJoined) {
        // alert(`SNAP CURRENTGAME ${!!snap[this.state.currentGameId]} GAME STARTED? ${!!snap[this.state.currentGameId]['gameHasStarted'] === true}`)
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
    let id = letter[Math.floor(Math.random() * letter.length)];

    for (let i = 0; i < 4; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  }

  createGame = () => {
    const id = this.generateUniqueId();
    this.db.ref(`games/${id}`).set({
      gameId: id,
      createdBy: this.user.displayName ? this.user.displayName : this.user.email,
      createdOn: (new Date()).toLocaleDateString(),
      gameHasStarted: false
    });
  }

  joinGame = (id) => {
    this.db.ref(`games/${id}/players/${this.user.displayName}`).update(this.user);
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
    this.db.ref(`games/${this.state.currentGameId}`).update({
      gameHasStarted: true
    });
  }

  render() {
    return (
      <div id='container' >
        <Navbar logout={true} />
        {/* <h1 className='page-title'>{`userJoined ${userHasJoined} gameId ${this.state.currentGameId}`}</h1> */}
        <h1 className='page-title' > Menu</h1>
        <main id='dashboard-content'>
          <section id='menu-options'>
            <Button
              icon='new'
              className='menu-options-btn'
              content='Nueva partida'
              clickHandler={this.createGame}
              isDisabled={this.maxGameNumber === 3}
            />
            <Button
              icon='join'
              className='menu-options-btn'
              content='Unirse'
              clickHandler={() => { console.log('unirse') }}
            />
          </section>
          <section id='menu-games-table'>
            <GamesTable
              gameList={this.state.gameList}
              joinGame={this.joinGame}
              deleteGame={this.deleteGame}
              removePlayer={this.removePlayer}
              userHasJoined={this.state.userHasJoined}
              currentGameId={this.state.currentGameId}
              user={this.user}
              startGame={this.startGame}
              showSpinner={this.state.showSpinner}
            />
          </section>
        </main>
      </div >
    );
  }
}

export default withRouter(Dashboard);
