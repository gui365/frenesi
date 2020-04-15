import React from 'react';
import './Navbar.scss';
import Logout from '../Logout';

const Navbar = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isGameScreen = window.location.pathname.includes('game');

  return (
    <header>
      <div className='navbar-div'>
        <img id='logo-main' src='/images/logo.png' alt='Frenesi logo' />
      </div>
      <div className='navbar-div navbar-options'>
        {
          !isGameScreen &&
          <>
            <img className='navbar-icon' id='icon-user' src='/images/icon-user.png' alt='user icon' />
            <img className='navbar-icon' id='icon-help' src='/images/icon-help.png' alt='help icon' />
            <Logout />
          </>
        }
        <span id='navbar-greeting'>{!isGameScreen ? 'Hola,' : null} {user.displayName ? user.displayName : user.email}</span>
      </div>
    </header>
  )
}

export default Navbar;