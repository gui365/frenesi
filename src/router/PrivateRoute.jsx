import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => (
      !!sessionStorage.getItem('user')
        ? <Component {...props} />
        : <Redirect to='/signin' />
    )} />
  )
}

export default PrivateRoute;