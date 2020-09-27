import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Login.scss';
import Button from '../Button';
import Logo from '../Logo';
import Input from '../Input';
import { fire } from '../../fire';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [userIsValid, setUserIsValid] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const handleChange = (event) => {
    if (event.target.name === 'email') {
      setEmail(event.target.value)
    } else {
      setPassword(event.target.value)
    }
  }

  const login = () => {
    setHidePassword(true);
    fire.auth().signInWithEmailAndPassword(email.trim(), password).then(userData => {
      if (!!userData) {
        const history = props.history;
        if (history) {
          history.push('/dashboard');
        }
        setUser(userData);
        setUserIsValid(true);
      }
    }).catch((err) => {
      if (err) {
        console.error(err);
        setError({
          code: err.code,
          message: err.message
        })
        return;
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email !== '' || password !== '') {
      login();
    }
  }

  const isInvalid = email === '' || password === '';

  const switchType = () => {
    setHidePassword(!hidePassword);
  }

  return (
    <form id="container-login" onSubmit={handleSubmit}>
      <Logo />
      {
        user && user.email && userIsValid
          ?
          <>
            <h1 id='logged-in-message'>Hola {user.displayName ? user.displayName : user.email}</h1>
            <Link to={'/dashboard'}>Ir al Menu</Link>
          </>
          :
          <>
            <div id="div-inputs-outer a-center j-center">
              <div className="div-inputs-inner d-flex a-center j-center">
                <Input label="email" name="email" changeFunction={handleChange} type="text" /><br />
              </div>
              <div className="div-inputs-inner d-flex a-center j-center">
                <Input label="contraseña" name="password" changeFunction={handleChange} type={hidePassword ? 'password' : 'text'} />
                <button id='btn-hide' type='button' onClick={switchType}>👁️</button>
              </div>
            </div>
            <div>
              <Button type="submit" isDisabled={isInvalid} content="Entrar" />
            </div>
            {
              error && error.message &&
              <div id="error-message">{error.message}</div>
            }
          </>
      }
    </form>
  )
}

export default withRouter(Login);