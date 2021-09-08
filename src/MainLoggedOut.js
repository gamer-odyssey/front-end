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
import About from './about.js'


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
      showOnlySearchResults: false
    }
  };

  handleChange = (e) => {
    this.setState({
      searchInput: e.target.value
    })
    console.log(this.state.searchInput)
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

  componentDidMount = () => {
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
    let field = `fields name, summary, platforms.name, first_release_date, cover.image_id; where first_release_date > ${todaysDate}; offset ${this.state.offset}; limit 10; search "${this.state.searchInput}";`;
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
      console.log(response.data);
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



  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <UpcomingLoggedOut
              comingSoon={this.state.comingSoon}
              offset={this.state.offset}
              finishedLoading={this.state.finishedLoading}
              returnedEmptySearch={this.state.returnedEmptySearch}
              previousPage={this.previousPage}
              nextPage={this.nextPage}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              handleShowAll={this.handleShowAll}
            />
          </Route>
          <Route exact path="/about-us">
            <About />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default withAuth0(HomePage);
