import React from 'react';
import axios from 'axios';
import Header from './Header.js';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comingSoon: [],
      offset: 0,
      games: [],
    }
  };

  // sends request to server to get the list of upcoming games, and passes offset as a query (initially 0)
  getComingSoon = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER}/coming_soon?offset=${this.state.offset}`);
      this.setState({
        comingSoon: response.data
      })
      console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  }

  // increases offset by 10, and then calls the above function again,  
  nextPage = async () => {
    await this.setState({
      offset: this.state.offset + 10
    });
    this.getComingSoon();
  }

  // decreases offset by 10
  previousPage = async () => {
    await this.setState({
      offset: this.state.offset - 10
    });
    this.getComingSoon();
  }


  //For Auht0 once we're ready
  // componentDidMount = asynce () => {
  //   try {
  //     const {  }
  //   }
  // }

  handleSubmit = async (e) => {
    e.preventDefault();
  }

  handleNewGame = async (addedGame) => {
    console.log('addedGame:', addedGame);
    
    let timestamp = addedGame.first_release_date * 1000; // multiplying by 1000 to convet timestamp from API (in secinds) to Javascript epoch time (in millisecinds)

    let dateObject = new Date(timestamp); // converting timestamp into Date object

    let dateHuman = `${dateObject.toLocaleString('default', { month: 'short' })} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;

    let config = {
      title: addedGame.name,
      email: 'delightingreen@gmail.com',
      releaseDate: dateHuman,
      note: 'Testing Note',  
    }
    try {
      let response = await axios.post('http://localhost:3001/gamelist', config);
      console.log(response);
      const newGame = response.data
      this.setState({
        games: [...this.state.games, newGame]
      })
    } catch (error) {
      console.log(error.response);
    }
  }

  render() {
    console.log('gameinfo :', this.state.games);
    let comingSoonToRender = this.state.comingSoon.map((game, idx) => {
      let timestamp = game.first_release_date * 1000; // multiplying by 1000 to convet timestamp from API (in secinds) to Javascript epoch time (in millisecinds)

      let dateObject = new Date(timestamp); // converting timestamp into Date object

      let dateHuman = `${dateObject.toLocaleString('default', { month: 'short' })} ${dateObject.getDate()}, ${dateObject.getFullYear()}`; // retrieving month, day and year from the Date object and converting to human friendly date

      let imgUrl = game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg` : 'https://images.igdb.com/igdb/image/upload/t_cover_small_2x/nocover_qhhlj6.jpg'; // some games come without cover image, in that case we will put an enmpty image of the same size

      let platforms = game.platforms.map((platform, idx) => <li key={idx}>{platform.name}</li>);
      let summary = game.summary;
      //this return belongs to map method

      return <ListGroup.Item key={idx}>
        <section className="listLine">
          <img alt="cover" src={imgUrl} />
          <div>
            <h4>{game.name}</h4>
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
                <p>{summary}</p>
              </div>
            </section>
          </div>
          <footer>
            <Button variant="primary" onClick={() => this.handleNewGame(game)}>Add Game</Button>
          </footer>
        </section>
      </ListGroup.Item>
    })

    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Container>
              <h1>Welcome to The Gaming Odyssey</h1>
              <Button onClick={this.getComingSoon} variant="success">Show Upcoming!</Button>
            </Container>
            {this.state.comingSoon.length !== 0 ?
              <Container>
                <div className="text-right">
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
              </Container>
              : ''}
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
