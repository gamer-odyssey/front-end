import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import './App.css';
import HomePage from './HomePage.js';
import Header from './Header';
import Container from 'react-bootstrap/Container';

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
            <Container>
              <HomePage />
            </Container>
            : <Container><h2>Please login to use the app</h2></Container>
          }
        </>
      );
    }
  }
}

export default withAuth0(App);
