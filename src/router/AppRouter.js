import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Authentication from '../pages/Authentication/Authentication';
import Admin from '../pages/Admin/Admin';
import Game from '../pages/Game/Game';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateRoute from '../router/PrivateRoute';
import { auth } from '../fire';

const AppRouter = () => {
  useEffect(() => {
    auth.onAuthStateChanged(userAuth => {
      if (userAuth !== JSON.parse(sessionStorage.getItem('user'))) {
        sessionStorage.setItem('user', JSON.stringify({
          email: userAuth.email,
          displayName: userAuth.displayName
        }));
      }
    });
  }, []);

  const privateRoutes = () => {
    return (
      <>
        <PrivateRoute path='/game/:gameId' component={Game} />
        <PrivateRoute path='/dashboard' component={Dashboard} />
      </>
    )
  }

  return (
    <Router forceRefresh={true}>
      <Route exact path='/'>
        {
          !!sessionStorage.getItem('user')
          ? <Redirect to={'/dashboard'} />
          : <Redirect to={'/signin'} />
        }
      </Route>
      <Route path='/admin' component={Admin} />
      <Route path='/signin' component={() => <Authentication />} />
      {privateRoutes()}
    </Router>
  );
}

export default AppRouter;
