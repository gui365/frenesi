import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, state, ...rest }) => {
  return (
    <Route {...rest} render={(props) => (
      !!sessionStorage.getItem('user')
        ? <Component {...props} {...state} />
        : <Redirect to='/signin' />
    )} />
  )
}

export default PrivateRoute;