import React from 'react';
import { withRouter } from 'react-router-dom';
import './GamesTable.scss';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';

const GamesTable = (props) => {
  const {
    gameListArray,
    joinGame,
    deleteGame,
    notEnoughPlayersError,
    removePlayer,
    userHasJoined,
    currentGameId,
    user,
    startGame,
    showSpinner
  } = props;

  const currentGame = gameListArray.filter(game => game.gameId === currentGameId)[0];
  const getPlayers = () => {
    if (currentGame) {
      const playersObject = currentGame.players;
      let playersString = '';
      let keyCount = 0;

      for (const key in playersObject) {
        keyCount++;
        playersString += (' ' + key);
        if (Object.keys(playersObject).length !== keyCount) {
          playersString += ',';
        }
      }
      return playersString;
    } else {
      return 'Este juego fue eliminado. Por favor, unite a otro.';
    }
  }

  const rejoinGame = (gameId) => {
    const history = props.history;
    if (history) {
      history.push(`/game/${gameId}`);
    }
  }

  return (
    <>
      <h2 className='bold'>Partidas</h2>
      {
        userHasJoined && currentGameId &&
        <>
          <div id='game-message-waiting'>
            <img id='star-icon-table' src='images/star.ico' alt='star-icon'></img>
            <div>
              <p style={{ marginBottom: '.2rem' }}><span className='bold'>{currentGameId} - Jugadores:</span></p>
              <p>{getPlayers()}</p>
            </div>
            <div id='game-btn-div'>
              {
                currentGame && (user.displayName === currentGame.createdBy) ?
                  <Button
                    id='game-btn-start'
                    content='Comenzar'
                    clickHandler={startGame}
                  />
                  : null
              }
              <Button
                id='game-btn-cancel'
                content='Salir'
                clickHandler={() => { removePlayer(currentGameId) }}
              />
            </div>
          </div>
          <p className='align-center m-b-2rem bold'>
            {!currentGame
              ? null
              : (user.displayName === currentGame.createdBy)
                ? notEnoughPlayersError
                  ? 'Se necesitan por lo menos 3 jugadores para empezar la partida'
                  : 'Dale click a "Comenzar" cuando todos los jugadores se hayan unido a la partida'
                : 'Esperando a que otros jugadores se unan a la partida'
            }
          </p>
        </>
      }
      {
        gameListArray.length ?
          <table id='games-table' className={userHasJoined && currentGameId ? 'opacity02' : null}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Creado por</th>
                {/* <th>Fecha</th> */}
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gameListArray.map(game => {
                return (
                  <tr className='data-row' key={`game-${game.gameId}`}>
                    <td>{game.gameId}</td>
                    <td>{game.createdBy}</td>
                    {/* <td>{game.createdOn}</td> */}
                    {
                      !game.gameHasStarted
                        ? (<>
                          <td>
                            <Button
                              icon='game'
                              isDisabled={userHasJoined && currentGameId}
                              className='game-options-btn'
                              clickHandler={() => { joinGame(game.gameId) }} />
                          </td>
                          <td>
                            <Button
                              icon='trash'
                              isDisabled={userHasJoined && currentGameId}
                              className='game-options-btn'
                              clickHandler={() => { deleteGame(game.gameId) }} />
                          </td>
                        </>)
                        : <td colSpan="2">
                          <Button
                            className='game-options-btn in-progress-btn'
                            content='En progreso'
                            clickHandler={() => { rejoinGame(game.gameId) }} />
                        </td>
                    }
                  </tr>
                )
              })}
            </tbody>
          </table>
          : showSpinner
            // ? <p>Cargando partidas...</p>
            ? <Spinner width='30px' height='30px' text='Cargando partidas...' />
            : <p>No hay partidas disponibles.</p>
      }

    </>
  )
};

export default withRouter(GamesTable);