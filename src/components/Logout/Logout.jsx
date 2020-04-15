import React from 'react';
import { withRouter } from 'react-router-dom';
import './Logout.scss';
import { fire } from '../../fire';

const Logout = (props) => {

  const logout = () => {
    fire.auth().signOut().then(() => {
      sessionStorage.clear();
      if (props.history) {
        const history = props.history;
        history.push('/signin');
      }
    }).catch(err => console.log(err));
  }

  return (
    <img onClick={logout} className='navbar-icon' id='icon-exit' src='/images/icon-exit.png' alt='exit icon' />
  )
}

export default withRouter(Logout);