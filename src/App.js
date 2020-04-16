import React, { Component } from 'react';
import AppRouter from './router/AppRouter';
import Footer from './components/Footer';
// import { auth } from './fire';

class App extends Component {

  // state = {
  //   user: ''
  // }

  // componentDidMount() {
  //   auth.onAuthStateChanged(userAuth => {
  //     if (userAuth !== JSON.parse(sessionStorage.getItem('user'))) {
  //       sessionStorage.setItem('user', JSON.stringify({
  //         email: userAuth.email,
  //         displayName: userAuth.displayName
  //       }));
  //       this.setState({
  //         user: sessionStorage.getItem('user')
  //       });
  //     }
  //   });
  // }

  render() {
    return (
      <div style={{ boxSizing: 'border-box' }}>
        <AppRouter />
        {
          window.location.pathname.includes('dashboard') &&
          <Footer />
        }
      </div>
    );
  }
}

export default App;
