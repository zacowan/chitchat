import React from 'react';
import {Route, Switch} from 'react-router-dom';

// Pages
import Home from './pages/Home';

const App = () => {
  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
    </Switch>
  );
};

export default App;
