import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import './App.css';
import HomeLoggedIn from './homePage/HomeLoggedIn.js';
import Header from './header/Header';
import Container from 'react-bootstrap/Container';
import HomeLoggedOut from './homePage/HomeLoggedOut';
import Footer from './footer/Footer';

class App extends React.Component {
  render() {
    const { isLoading, isAuthenticated } = this.props.auth0
    return (
      <>
        <div id="all-container">
          <div id="content-container">
            <Header isAuthenticated={isAuthenticated} isLoading={isLoading} />
            {isLoading ? <h3 style={{ textAlign: "center" }}>Loading...</h3>
              : isAuthenticated ?
                <Container fluid="xl">
                  <HomeLoggedIn />
                </Container>
                : <Container>
                  <HomeLoggedOut />
                </Container>
            }
          </div>
          <Footer />
        </div>
      </>
    );
  }
}


export default withAuth0(App);
