import React from 'react';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import UpcomingLoggedOut from './UpcomingLoggedOut.js';


const server = process.env.REACT_APP_SERVER

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comingSoon: [],
      offset: 0,
      finishedLoading: false
    }
  };

  componentDidMount = async () => {
    this.getComingSoon();
  }

  getComingSoon = async () => {
    try {
      const response = await axios.get(`${server}/coming_soon?offset=${this.state.offset}`);
      this.setState({
        comingSoon: response.data,
        finishedLoading: true
      })
      console.log(response.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  nextPage = async () => {
    await this.setState({
      offset: this.state.offset + 10,
      finishedLoading: false
    });
    this.getComingSoon();
    window.scrollTo(0, 0);
  }

  previousPage = async () => {
    await this.setState({
      offset: this.state.offset - 10,
      finishedLoading: false
    });
    this.getComingSoon();
    window.scrollTo(0, 0);
  } 

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <UpcomingLoggedOut
              comingSoon={this.state.comingSoon}
              finishedLoading={this.state.finishedLoading}
              offset={this.state.offset}            
              previousPage={this.previousPage}
              nextPage={this.nextPage}
            />
          </Route>
          <Route exact path="/about-us">
            <h1>About the Gaming Odyssey Team</h1>
          </Route>      
        </Switch>
      </Router>
    );
  }
}

export default withAuth0(HomePage);
