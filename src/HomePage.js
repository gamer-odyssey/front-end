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
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

const deployed_server = process.env.DEPLOYED_REACT_APP_SERVER
const local_server = process.env.REACT_APP_SERVER

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
      const response = await axios.get(`${deployed_server}/coming_soon?offset=${this.state.offset}`);
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
      let response = await axios.get(`${deployed_server}/gamelist`, config);
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
      let response = await axios.post(`${deployed_server}/gamelist`, config);
      console.log(response);
      const newGame = response.data
      this.setState({
        wishlist: [...this.state.wishlist, newGame]
      })
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
      await axios.delete(`${deployed_server}/gamelist/${id}`, config);
      let remainingGames = this.state.wishlist.filter(game => game._id !== id);
      this.setState({
        wishlist: remainingGames
      })
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
      await axios.put(`${deployed_server}/gamelist/${game._id}`, config);
      const updateWishList = this.state.wishlist.map(stateGame => {
        if (stateGame._id === game._id) {
          return game
        } else {
          return stateGame;
        }
      });
      this.setState({ wishlist: updateWishList });
    } catch (error) {
      console.log(error.response)
    }
  }

  render() {
    const { isLoading, isAuthenticated } = this.props.auth0;

    let comingSoonToRender = this.state.comingSoon.map((game, idx) => {
      let timestamp = game.first_release_date * 1000;
      let dateObject = new Date(timestamp);
      let dateHuman = `${dateObject.toLocaleString('default', { month: 'short' })} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
      let imgUrl = game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg` : 'https://images.igdb.com/igdb/image/upload/t_cover_small_2x/nocover_qhhlj6.jpg';
      let platforms = game.platforms.map((platform, idx) => <li key={idx}>{platform.name}</li>);
      let match = this.state.wishlist.filter(wishlistGame => wishlistGame.title === game.name);

      return <ListGroup.Item key={idx}>
        <section className="listLine">
          <img alt="cover" src={imgUrl} />
          <div>
            <div className="titleButtonGroup">
              <h4>{game.name}</h4>
              {isAuthenticated ?
                <>
                  {match.length > 0 ?
                    <Button variant="link" disabled>In your wishlist</Button>
                    : <Button variant="outline-success" onClick={() => this.handleNewGame(game)}>Add to wishlist</Button>
                  }
                </>
                : <Button variant="link" disabled>Sign in to add to wishlist</Button>}
            </div>
            <p>Release date: {dateHuman}</p>
            <section className="summary">
              <div className="platformsUl">
                <ul>
                  <h5>Platforms</h5>
                  {platforms}
                </ul>
              </div>
              <div>
                <h5>Summary:</h5>
                <p>{game.summary}</p>
              </div>
            </section>
          </div>
        </section>
      </ListGroup.Item>
    })

    if (isLoading) {
      return <h2>Still Loading...</h2>
    } else {
      return (
        <Router>
          <Switch>
            <Route exact path="/">

              <h1>Welcome to The Gaming Odyssey</h1>
              <p>Here, you can look through all of the upcoming video games and add them to your personal wish list</p>
              {/* <Button onClick={this.getComingSoon} variant="success">Show Upcoming!</Button> */}

              {this.state.comingSoon.length !== 0 ?
                <>
                  <div className="text-right">
                    {this.state.finishedLoading ? '' : <Spinner animation="border" variant="success" size="sm"/>}
                    {' '}
                    <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.previousPage} disabled={this.state.offset > 0 ? false : true} >Previous Page</Button>
                    {' '}
                    <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.nextPage}>Next Page</Button>
                  </div>
                  <ListGroup>
                    {comingSoonToRender}
                  </ListGroup>
                  <div className="text-right">
                    <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.previousPage} disabled={this.state.offset > 0 ? false : true} >Previous Page</Button>
                    {' '}
                    <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.nextPage}>Next Page</Button>
                  </div>
                </>
                : <div style={{textAlign: "center"}}><Spinner animation="border" variant="success" /></div>}
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
}

export default withAuth0(HomePage);
