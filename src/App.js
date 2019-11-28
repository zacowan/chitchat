import React, {useEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

// Custom components
import {withFirebase} from './components/Firebase';

// Pages
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

const LoadingBox = () => {
  return (
    <Box
      bgcolor='background.paper'
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress />
    </Box>
  );
};

const App = ({firebase}) => {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const signIn = async () => {
      await firebase.signIn();
      setSignedIn(true);
    };
    if (firebase.checkUser()) {
      setSignedIn(true);
    } else {
      signIn();
    }
  });
  if (!signedIn) {
    return <LoadingBox />;
  }
  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/chatroom/:roomId'>
        <ChatRoom />
      </Route>
    </Switch>
  );
};

export default withFirebase(App);
