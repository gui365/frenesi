import React from 'react';
import './GamesTable.scss';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';

const GamesTable = (props) => {
  const {
    gameList,
    joinGame,
    deleteGame,
    removePlayer,
    userHasJoined,
    currentGameId,
    user,
    startGame,
    showSpinner
  } = props;

  const currentGame = gameList.filter(game => game.gameId === currentGameId)[0];
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

  return (
    <>
      <h2 className='bold'>{`ID: ${currentGameId} Game: ${JSON.stringify(currentGame)}`}</h2>
      {
        userHasJoined && currentGameId &&
        <>
          <div id='game-message-waiting'>
            <img id='star-icon' src='images/star.ico' alt='star-icon'></img>
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
                ? 'Dale click a "Comenzar" cuando todos los jugadores esten listos'
                : 'Esperando a que otros jugadores se unan a la partida'
            }
          </p>
        </>
      }
      {
        gameList.length ?
          <table className={userHasJoined && currentGameId ? 'opacity02' : null}>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Creador</th>
                <th>Fecha</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gameList.map(game => {
                return (
                  <tr className='data-row' key={game.gameId}>
                    <td>{game.gameId}</td>
                    <td>{game.createdBy}</td>
                    <td>{game.createdOn}</td>
                    {
                      !game.gameHasStarted
                        ? (<>
                          <td>
                            <Button
                              icon='game'
                              isDisabled={userHasJoined && currentGameId}
                              className='game-options-btn'
                              // content='Unirse'
                              clickHandler={() => { joinGame(game.gameId) }} />
                          </td>
                          <td>
                            <Button
                              icon='trash'
                              isDisabled={userHasJoined && currentGameId}
                              className='game-options-btn'
                              // content='x'
                              clickHandler={() => { deleteGame(game.gameId) }} />
                          </td>
                        </>)
                        : <td>
                          <Button
                            isDisabled={true}
                            className='game-options-btn in-progress-btn'
                            content='En progreso'
                          />
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

export default GamesTable;