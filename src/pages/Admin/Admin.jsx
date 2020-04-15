import React, { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { fire } from '../../fire';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'password-repeat':
        setPasswordRepeat(event.target.value);
        break;
      case 'nombre':
        setDisplayName(event.target.value);
        break;
      default:
        break;
    }
    return;
  }

  const createUser = () => {
    fire.auth().createUserWithEmailAndPassword(email, password).then((userData) => {
      userData.user.updateProfile({
        displayName
      }).then(() => {
        alert('Successfully created user ' + email);
      });
    }).catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === passwordRepeat) {
      if (email !== '' || password !== '' || passwordRepeat !== '' || displayName !== '') {
        createUser();
        return;
      } else {
        alert('Todos los campos son obligatorios');
      }
    } else {
      alert('Las contraseñas no coinciden');
    }
  }

  return (
    <div id='admin-container'>
      <form id="container-login" onSubmit={handleSubmit}>
        <img id="star-icon" src="images/star.ico" alt="star-icon"></img>
        <img id="logo-login" src="/images/logo.png" alt="Frenesi logo" />
        <div>
          <Input label="email" name="email" changeFunction={handleChange} type="text" /><br />
          <Input label="contraseña" name="password" changeFunction={handleChange} type="password" /><br />
          <Input label="repetir contraseña" name="password-repeat" changeFunction={handleChange} type="password" /><br />
          <Input label="nombre" name="nombre" changeFunction={handleChange} type="text" />
        </div>
        <div>
          <Button type='submit' content="Crear Usuario" />
        </div>
      </form>
    </div>
  );
}

export default Admin;
