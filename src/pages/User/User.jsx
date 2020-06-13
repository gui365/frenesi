import React, { Component } from 'react';
import Navbar from '../../components/Navbar';

class User extends Component {
  render() {
    return (
      <>
        <Navbar />
        <p>User page</p>
      </>
    )
  }
}

// export default withRouter(User);
export default User;