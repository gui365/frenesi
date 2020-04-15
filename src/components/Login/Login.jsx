import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Login.scss';
import Button from '../Button';
import Input from '../Input';
import { fire } from '../../fire';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));

  const handleChange = (event) => {
    if (event.target.name === 'email') {
      setEmail(event.target.value)
    } else {
      setPassword(event.target.value)
    }
  }

  const login = () => {
    fire.auth().signInWithEmailAndPassword(email, password).then(userData => {
      if (!!userData) {
        const history = props.history;
        if (history) {
          history.push('/dashboard');
        }
        setUser(userData);
      }
    }).catch((err) => {
      if (err) {
        console.log(err);
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

  return (
    <form id="container-login" onSubmit={handleSubmit}>
      <img id="star-icon" src="images/star.ico" alt="star-icon"></img>
      <img id="logo-login" src="/images/logo.png" alt="Frenesi logo" />
      {
        user && user.email
          ?
          <>
            <h1 id='logged-in-message'>Hola {user.displayName ? user.displayName : user.email}</h1>
            <Link to={'/dashboard'}>Ir al Menu</Link>
          </>
          :
          <>
            <div>
              <Input label="email" name="email" changeFunction={handleChange} type="text" /><br />
              <Input label="contraseña" name="password" changeFunction={handleChange} type="password" />
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