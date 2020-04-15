import React, { createContext, Component } from 'react';
import { auth } from '../fire';

export const UserContext = createContext();

class UserProvider extends Component {
  state = {
    user: { name: 'Guillermo' }
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(userAuth => {
      console.log('updating auth state');
      this.setState({ user: userAuth });
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;