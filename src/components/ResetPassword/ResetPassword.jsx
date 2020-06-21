import React, { Component } from 'react';
import Button from '../Button';
import { fire } from '../../fire';
import '../Login/Login.scss';
import './ResetPassword.scss';
import { withRouter } from 'react-router-dom';

class ResetPassword extends Component {

  resetPassword = () => {
    const emailAddress = JSON.parse(sessionStorage.getItem('user')).email;
    fire.auth().sendPasswordResetEmail(emailAddress).then(res => {
      fire.auth().signOut().then(() => {
        sessionStorage.clear();
        alert('Por favor, chequeá tu cuenta de correo electrónico y seguí las instrucciones. Si el email not te llegó, chequeá tu carpeta de correo no deseado.');
        if (this.props.history) {
          const history = this.props.history;
          history.push('/signin');
        }
      }).catch(err => console.error(err));
    }).catch(err => {
      console.error(err);
    });
  }

  render() {
    return (
      <div className='reset-container'>
        <p className='reset-instructions'>Para enviar un email con instrucciones acerca de cómo cambiar tu contraseña, hace click acá. Al hacer click vas a volver a la página principal para hacer login.</p>
        <Button className='reset-button' type='button' clickHandler={this.resetPassword} content="Enviar email" />
      </div>
    )
  }
}

export default withRouter(ResetPassword);