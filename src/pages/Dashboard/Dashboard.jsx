import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './Dashboard.scss';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import GamesTable from '../../components/GamesTable';
import { fire } from '../../fire';

const Dashboard = (props) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const db = fire.database();
  const [maxGameNumber, setMaxGameNumber] = useState(0);
  const [gameList, setGameList] = useState([]);
  const [currentGameId, setCurrentGameId] = useState('');
  const [userHasJoined, setUserHasJoined] = useState(false);

  useEffect(() => {
    console.log('currentGameId', currentGameId)
    db.ref('games').on('value', snapshot => {
      const snap = snapshot.val();
      const objToArray = [];
      for (const key in snap) {
        if (snap.hasOwnProperty(key)) {
          objToArray.push(snap[key]);
        }
      }
      setGameList(objToArray);
      setMaxGameNumber(objToArray.length);

      if (snap && currentGameId) {
        if (snap[currentGameId] && snap[currentGameId]['gameHasStarted'] === true) {
          const history = props.history;
          if (history) {
            history.push(`/game/${currentGameId}`);
          }
        }
      }
    });
  }, [db, props.history, currentGameId])

  const generateUniqueId = () => {
    const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = letter[Math.floor(Math.random() * letter.length)];

    for (let i = 0; i < 4; i++) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  }

  const createGame = () => {
    const id = generateUniqueId();
    db.ref(`games/${id}`).set({
      gameId: id,
      createdBy: user.displayName ? user.displayName : user.email,
      createdOn: (new Date()).toLocaleDateString(),
      gameHasStarted: false
    });
  }

  const joinGame = (id) => {
    db.ref(`games/${id}/players/${user.displayName}`).update(user);
    setUserHasJoined(true);
    setCurrentGameId(id);
  }

  const deleteGame = (id) => {
    db.ref(`games/${id}`).remove();
  }

  const removePlayer = (id) => {
    db.ref(`games/${id}/players/${user.displayName}`).remove();
    setUserHasJoined(false);
    setCurrentGameId('');
  }

  const startGame = () => {
    console.log('start game')
    db.ref(`games/${currentGameId}`).update({
      gameHasStarted: true
    });
  }

  return (
    <div id='container'>
      <Navbar logout={true} />
      <main id='dashboard-content'>
        <h1>Menu</h1>
        <section id='menu-options'>
          <Button
            icon='new'
            className='menu-options-btn'
            content='Nueva partida'
            clickHandler={createGame}
            isDisabled={maxGameNumber === 3}
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
            gameList={gameList}
            joinGame={joinGame}
            deleteGame={deleteGame}
            removePlayer={removePlayer}
            userHasJoined={userHasJoined}
            currentGameId={currentGameId}
            user={user}
            startGame={startGame}
          />
        </section>
      </main>
    </div>
  );
}

export default withRouter(Dashboard);
