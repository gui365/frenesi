import React, { Component } from 'react';
import './User.scss';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ResetPassword from '../../components/ResetPassword/ResetPassword';
import { fire } from '../../fire';

class User extends Component {
  state = {
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

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.displayName !== '') {
      this.handleDisplayNameChange();
    } else {
      alert('Por favor, ingresá un nuevo nombre.');
    }
  }

  sectionTitleClasses = 'user-section-title d-flex a-center j-between px-1rem';

  handleNavClick = (event) => {
    const section = event.target.getAttribute('name');
    const currentState = this.state.section;
    this.setState({
      section: currentState === section ? '' : section
    });
  }

  handleDisplayNameChange = (event) => {
    const user = fire.auth().currentUser;
    if (this.state.displayName !== user.displayName) {
      user.updateProfile({
        displayName: this.state.displayName
      }).then((res) => {
        alert('Tu nombre fue cambiado correctamente.');
        const user = JSON.parse(sessionStorage.get('user'));
        user.displayName = this.state.displayName;
        sessionStorage.setItem('user', JSON.stringify(user));
      }).catch((error) => {
        console.error(error);
      });
    } else {
      alert('El nuevo nombre debe ser distinto al actual.')
    }
  }

  render() {
    return (
      <div id='container' >
        <Navbar optionBack={true} />
        <h1 className='page-title'>Mi cuenta</h1>
        <main id='user-info-container' className='align-center'>
          <h1 className='bold m-y-1rem'>Administrar mis datos</h1>
          <div id='user-info-container-options'>
            <div name='reset-password'
              className={this.sectionTitleClasses}
              onClick={this.handleNavClick}>
              <span name='reset-password'>Cambiar mi contraseña</span>
              <Button
                name='reset-password'
                icon={this.state.section === 'reset-password' ? 'collapse' : 'expand'}
                imageProps={{ name: 'reset-password' }}
              />
            </div>
            {
              this.state.section === 'reset-password' &&
              < section >
                <ResetPassword />
              </section>
            }

            <div name='change-name'
              className={this.sectionTitleClasses}
              onClick={this.handleNavClick}>
              <span name='change-name'>Cambiar mi nombre</span>
              <Button
                name='change-name'
                icon={this.state.section === 'change-name' ? 'collapse' : 'expand'}
                imageProps={{ name: 'change-name' }}
              />
            </div>
            {
              this.state.section === 'change-name' &&
              < section >
                <form id='container-signup' className='container-signup' onSubmit={this.handleSubmit}>
                  <div>
                    <Input label="nuevo nombre" name="displayName" changeFunction={this.handleChange} type="text" />
                  </div>
                  <div>
                    <Button type='submit' content="Aceptar" />
                  </div>
                </form>
              </section>
            }

            {/* <div name='choose-avatar'
              className={this.sectionTitleClasses}
              onClick={this.handleNavClick}>
              <span name='choose-avatar'>Elegir mi avatar</span>
              <Button
                name='choose-avatar'
                icon={this.state.section === 'choose-avatar' ? 'collapse' : 'expand'}
                imageProps={{ name: 'choose-avatar' }}
              />
            </div>
            {
              this.state.section === 'choose-avatar' &&
              < section >
                <p>Elegir mi avatar</p>
              </section>
            } */}
          </div>

          {/* <h1 className='bold m-y-1rem'>Mis logros</h1>
          <div id='user-achievements-container-options'>
            <p>Ganaste:</p>
            <p><span>162</span> rondas</p>
            <p><span>13</span> partidas</p>
            <br/>
            <p>Tu carta preferida:</p>
            <p>Fito Paez</p>
          </div> */}
        </main >
      </div>
    )
  }
}

export default User;