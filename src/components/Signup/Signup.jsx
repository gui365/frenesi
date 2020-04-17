import React, { Component } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { fire } from '../../fire';
import '../Login/Login.scss';
import './Signup.scss';

class Signup extends Component {
  state = {
    email: '',
    password: '',
    passwordRepeat: '',
    displayName: '',
    section: ''
  }

  handleChange = (event) => {
    let field = event.target.name;
    let value = event.target.value;

    this.setState({
      [field]: value
    });
  }

  createUser = () => {
    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((userData) => {
      userData.user.updateProfile({
        displayName: this.state.displayName
      }).then(() => {
        alert(`Successfully created user for "${this.state.displayName}" using email "${this.state.email}"`);
        this.setState({
          email: '',
          password: '',
          passwordRepeat: '',
          displayName: ''
        });
      });
    }).catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  // ma, michiquita
  // ga, pa, matucampeon
  // lo, julicampeon

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.password === this.state.passwordRepeat) {
      if (this.state.email !== ''
        && this.state.password !== ''
        && this.state.passwordRepeat !== ''
        && this.state.displayName !== '') {
        this.createUser();
      } else {
        alert('Todos los campos son obligatorios');
      }
    } else {
      alert('Las contraseñas no coinciden');
    }
  }

  render() {
    return (
      <form id='container-signup' className='container-signup' onSubmit={this.handleSubmit}>
        <div>
          <Input label="email" name="email" changeFunction={this.handleChange} type="text" /><br />
          <Input label="contraseña" name="password" changeFunction={this.handleChange} type="password" /><br />
          <Input label="repetir contraseña" name="passwordRepeat" changeFunction={this.handleChange} type="password" /><br />
          <Input label="nombre" name="displayName" changeFunction={this.handleChange} type="text" />
        </div>
        <div>
          <Button type='submit' content="Crear Usuario" />
        </div>
      </form>
    )
  }
}

export default Signup;