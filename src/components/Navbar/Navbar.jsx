import React, { useState, useEffect } from 'react';
import './Navbar.scss';
import Logout from '../Logout';

const Navbar = ({ players, answersLeft, questionsLeft }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isGameScreen = window.location.pathname.includes('game');
  const [playerList, setPlayerList] = useState(null);
  // const [numAnswersLeft, setNumAnswersLeft] = useState(0);
  const [numQuestionsLeft, setNumQuestionsLeft] = useState(0);

  useEffect(() => {
    if (!!players) {
      const playersArray = Object.entries(players);
      // setPlayerList([
      //   ['Guille', { wins: 2 }],
      //   ['Lore', { wins: 7 }],
      //   ['Gaby', { wins: 0 }],
      //   ['Guillermo', { wins: 1 }],
      //   ['Edu', { wins: 2 }],
      //   ['Matu', { wins: 4 }],
      //   ['Normi', { wins: 2 }],
      //   ['Obi', { wins: 1 }],
      //   ['Luli', { wins: 15 }]
      // ]);
      setPlayerList(playersArray);
      // setNumAnswersLeft(answersLeft);
      setNumQuestionsLeft(questionsLeft);
    }
  }, [players, answersLeft, questionsLeft]);

  return (
    <header className={isGameScreen ? 'isGameScreen' : ''}>
      {
        !isGameScreen
          ? <>
            <div className='navbar-div'>
              <img id='logo-main' src='/images/logo.png' alt='Frenesi logo' />
            </div>
            <div className='navbar-div navbar-options'>
              <img className='navbar-icon' id='icon-user' src='/images/icon-user.png' alt='user icon' />
              <img className='navbar-icon' id='icon-help' src='/images/icon-help.png' alt='help icon' />
              <Logout />
              <span id='navbar-greeting'>{!isGameScreen ? 'Hola,' : null} {user.displayName ? user.displayName : user.email}</span>
            </div>
          </>
          : <>
            {!!playerList && !!Object.entries(playerList).length &&
              <>
                {/* <div className='navbar-div'>
                  <div className='a-left d-flex a-center flex-direction-column'>
                    <span className='a-left-number'>{numAnswersLeft}</span>
                  </div>
                </div> */}
                <div className='navbar-div'>
                  <div className='q-left d-flex a-center flex-direction-column'>
                    <span className='q-left-number'>{numQuestionsLeft}</span>
                  </div>
                </div>
                <div className='navbar-div navbar-options scores'>
                  {
                    playerList.map(p => {
                      return (
                        <div key={`score-card-${p[0]}`} className='player-points d-flex a-center j-center'>
                          <span className='player-name'>{p[0]}</span>
                          <img style={{width: '15px', margin: '0 1px'}} src='/images/star.ico' alt='star' />
                          <span className='player-score bold'>{p[1].wins}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </>
            }
          </>
      }
    </header>
  )
}

export default Navbar;