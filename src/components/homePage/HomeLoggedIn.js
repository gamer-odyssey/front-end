import React from 'react';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import UpcomingLoggedIn from '../upcoming/UpcomingLoggedIn.js';
import About from '../aboutUs/about.js';
import Wishlist from '../favorites/Favorites.js';
import Profile from '../profile/Profile';

const server = process.env.REACT_APP_SERVER

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comingSoon: [],
      offset: 0,
      finishedLoading: false,
      returnedEmptySearch: false,
      searchInput: '',
      showOnlySearchResults: false,
      wishlist: []
    }
  };

  handleChange = (e) => {
    this.setState({
      searchInput: e.target.value
    })    
  }

  getComingSoon = async () => {
    try {
      const response = await axios.get(`${server}/coming_soon?offset=${this.state.offset}`);

      if (response.data.length > 0) {
        this.setState({
          comingSoon: response.data,
          finishedLoading: true
        })
      } else {
        this.setState({
          finishedLoading: true,
          returnedEmptySearch: true
        })
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  nextPage = async () => {
    await this.setState({
      offset: this.state.offset + 10,
      finishedLoading: false
    });
    if (this.state.showOnlySearchResults) {
      this.getSearchResults();
    } else {
      this.getComingSoon();
    }
    window.scrollTo(0, 0);
  }

  previousPage = async () => {
    await this.setState({
      offset: this.state.offset - 10,
      finishedLoading: false
    });
    if (this.state.showOnlySearchResults) {
      this.getSearchResults();
    } else {
      this.getComingSoon();
    };
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
      let response = await axios.get(`${server}/gamelist`, config);
      this.setState({
        wishlist: response.data
      })
    } catch (error) {
      console.log(error.response);
    }
    if (this.state.showOnlySearchResults) {
      this.getSearchResults();
    } else {
      this.getComingSoon();
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.setState({
      returnedEmptySearch: false,
      finishedLoading: false
    })
    if (this.state.searchInput.length === 0) {
      await this.setState({
        showOnlySearchResults: false,
        offset: 0
      })
      this.getComingSoon()
    } else {
      await this.setState({
        offset: 0,
        showOnlySearchResults: true
      })
      this.getSearchResults();
    }
  }

  getSearchResults = async () => {
    let todaysDate = Math.floor(Date.now() / 1000);
    let field = `fields name, summary, screenshots.image_id, platforms.name, first_release_date, cover.image_id; where first_release_date > ${todaysDate}; offset ${this.state.offset}; limit 10; search "${this.state.searchInput}";`;
    try {
      const response = await axios.get(`${server}/search?field=${field}`);
      if (response.data.length > 0) {
        this.setState({
          comingSoon: response.data,
          finishedLoading: true,
          returnedEmptySearch: false
        })
      } else {
        this.setState({
          comingSoon: response.data,
          finishedLoading: true,
          returnedEmptySearch: true
        })
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  handleShowAll = async () => {
    await this.setState({
      finishedLoading: false,
      returnedEmptySearch: false,
      offset: 0,
      showOnlySearchResults: false,
    })
    this.getComingSoon()
  }

  handleNewGame = async (addedGame) => {
    let timestamp = addedGame.first_release_date * 1000;
    let dateObject = new Date(timestamp);
    let dateHuman = `${dateObject.toLocaleString('default', { month: 'short' })} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
    let cover = addedGame.cover ? addedGame.cover.image_id : '';
    let screenshots = addedGame.screenshots ? addedGame.screenshots : '';    
    let config = {
      title: addedGame.name,
      email: this.props.auth0.user.email,
      releaseDate: dateHuman,
      note: '',
      cover: cover,
      summary: addedGame.summary,
      platforms: addedGame.platforms,
      screenshots: screenshots
    }
    try {
      let response = await axios.post(`${server}/gamelist`, config);
      const newGame = response.data;  
      this.setState({
        wishlist: [...this.state.wishlist, newGame]
      });
    } catch (error) {
      console.log(error.message);
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
      await axios.delete(`${server}/gamelist/${id}`, config);
      let remainingGames = this.state.wishlist.filter(game => game._id !== id);
      this.setState({ wishlist: remainingGames });
    } catch (err) {
      console.log(err.message);
    }
  }

  handleUpdate = async (game) => {
    const { getIdTokenClaims } = this.props.auth0;
    let tokenClaims = await getIdTokenClaims();
    const jwt = tokenClaims.__raw;    
    let screenshots = game.screenshots ? game.screenshots : '';
    

    const config = {
      headers: { authorization: `Bearer ${jwt}` },
      params: {
        title: game.title,
        releaseDate: game.releaseDate,
        email: this.props.auth0.user.email,
        note: game.note,
        cover: game.cover,
        summary: game.summary,
        platforms: game.platforms,
        screenshots: screenshots
      }
    };

    try {
      await axios.put(`${server}/gamelist/${game._id}`, config);
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
            <UpcomingLoggedIn
              comingSoon={this.state.comingSoon}
              offset={this.state.offset}
              finishedLoading={this.state.finishedLoading}
              returnedEmptySearch={this.state.returnedEmptySearch}
              previousPage={this.previousPage}
              nextPage={this.nextPage}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              handleShowAll={this.handleShowAll}
              wishlist={this.state.wishlist}
              handleNewGame={this.handleNewGame}
            />
          </Route>
          <Route exact path="/about-us">
            <About />
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
