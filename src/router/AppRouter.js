import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Authentication from '../pages/Authentication/Authentication';
import Admin from '../pages/Admin/Admin';
import Game from '../pages/Game/Game';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateRoute from '../router/PrivateRoute';
import { auth } from '../fire';
import Spinner from '../components/Spinner';

const AppRouter = (props) => {
  const displayName = !!sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).displayName
    : 'No name to display';

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
        <PrivateRoute
          path='/game/:gameId'
          component={Game}
          state={{ player: displayName }}
        />
        <PrivateRoute
          path='/admin'
          component={Admin}
        />
        {
          props.cards &&
          <PrivateRoute
            path='/dashboard'
            component={Dashboard}
            state={{ cards: props.cards }}
          />
        }
      </>
    )
  }

  return (
    <>
      {
        window.location.pathname.includes('dashboard') && !props.cards &&
        <Spinner width='5rem' height='5rem' styleImg={{ marginTop: '5rem' }} />
      }
      <Router forceRefresh={true}>
        <Route exact path='/'>
          {
            !!sessionStorage.getItem('user')
              ? <Redirect to={'/dashboard'} />
              : <Redirect to={'/signin'} />
          }
        </Route>
        <Route path='/signin' component={() => <Authentication />} />
        {privateRoutes()}
      </Router>
    </>
  );
}

export default AppRouter;
