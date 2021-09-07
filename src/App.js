import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import './App.css';
import HomePage from './HomePage.js';
import Header from './Header';
import Container from 'react-bootstrap/Container';
import MainLoggedOut from './MainLoggedOut';

class App extends React.Component {
  render() {
    const { isLoading, isAuthenticated } = this.props.auth0

    if (isLoading) {
      return (
        <>
          <Header isAuthenticated={isAuthenticated} />
          <h3 style={{ textAlign: "center" }}>Loading...</h3>
        </>
      )
    } else {
      return (
        <>
          <Header isAuthenticated={isAuthenticated} />
          {isAuthenticated ?
            <Container fluid="xl">
              <HomePage />
            </Container>
            : <Container>
              <MainLoggedOut />
            </Container>
          }
        </>
      );
    }
  }
}

export default withAuth0(App);
