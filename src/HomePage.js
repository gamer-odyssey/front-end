import React from 'react';
import axios from 'axios';
import Wishlist from './Wishlist.js';
import Profile from './Profile';
import { withAuth0 } from '@auth0/auth0-react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Upcoming from './Upcoming.js';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comingSoon: [],
      wishlist: [],
      offset: 0,
      finishedLoading: false
    }
  };

  getComingSoon = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/coming_soon?offset=${this.state.offset}`);
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

  componentDidMount = async () => {
    const { getIdTokenClaims } = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;
    const config = {
      headers: { authorization: `Bearer ${jwt}` },
      params: { email: this.props.auth0.user.email },
    };
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER}/gamelist`, config);
      console.log(response.data);
      this.setState({
        wishlist: response.data
      })
    } catch (error) {
      console.log(error.response);
    }
    this.getComingSoon();
  }

  handleNewGame = async (addedGame) => {
    let timestamp = addedGame.first_release_date * 1000;
    let dateObject = new Date(timestamp);
    let dateHuman = `${dateObject.toLocaleString('default', { month: 'short' })} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;

    let config = {
      title: addedGame.name,
      email: this.props.auth0.user.email,
      releaseDate: dateHuman,
      note: ''
    }
    try {
      let response = await axios.post('http://localhost:3001/gamelist', config);
      console.log(response);
      const newGame = response.data
      this.setState({
        wishlist: [...this.state.wishlist, newGame]
      });
    } catch (error) {
      console.log(error.response);
    }
  }

  handleDelete = async (id) => {
    try {
      const { getIdTokenClaims } = this.props.auth0;
      let tokenClaims = await getIdTokenClaims();
      const jwt = tokenClaims.__raw;
      const config = {
        headers: { "Authorization": `Bearer ${jwt}` },
        params: { email: this.props.auth0.user.email },
      };
      await axios.delete(`http://localhost:3001/gamelist/${id}`, config);
      let remainingGames = this.state.wishlist.filter(game => game._id !== id);
      this.setState({wishlist: remainingGames});
    } catch (err) {
      console.log(err.response);
    }
  }

  handleUpdate = async (game) => {
    const { getIdTokenClaims } = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;
    const config = {
      headers: { authorization: `Bearer ${jwt}` },
      params: {
        title: game.title,
        releaseDate: game.releaseDate,
        email: this.props.auth0.user.email,
        note: game.note
      }
    };

    try {
      await axios.put(`http://localhost:3001/gamelist/${game._id}`, config);
      const updateWishList = this.state.wishlist.map(stateGame => {
        if (stateGame._id === game._id) {
          return game
        } else {
          return stateGame;
        }
      });
      this.setState({ wishlist: updateWishList });
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <Upcoming
              comingSoon={this.state.comingSoon}
              finishedLoading={this.state.finishedLoading}
              offset={this.state.offset}
              wishlist={this.state.wishlist}
              handleNewGame={this.handleNewGame}
              previousPage={this.previousPage}
              nextPage={this.nextPage}
            />
          </Route>
          <Route exact path="/about-us">
            <h1>About the Gaming Odyssey Team</h1>
          </Route>
          <Route exact path="/odyssey">
            <Wishlist
              wishlist={this.state.wishlist}
              handleDelete={this.handleDelete}
              handleUpdate={this.handleUpdate}
            />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default withAuth0(HomePage);