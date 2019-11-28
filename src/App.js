import React, {useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';

// Custom components
import {withFirebase} from './components/Firebase';

// Pages
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

const App = ({firebase}) => {
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
