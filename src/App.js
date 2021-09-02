import React from 'react';
import Header from './Header.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <h1>Welcome to The Gaming Odyssey</h1>
          </Route>
          <Route exact path="/about-us">
            <h1>About the Gaming Odyssey Team</h1>
          </Route>
          <Route exact path="/odyssey">
            <h1>Take a look at upcoming Gaming Odysseys</h1>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
