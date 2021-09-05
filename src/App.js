import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import './App.css';
import HomePage from './HomePage.js';
import Header from './Header';

class App extends React.Component {
  render() {
    const { isLoading, isAuthenticated } = this.props.auth0

    if (isLoading) {
      return <h2>Still Loading...</h2>
    } else {
      return (
        <>
        <Header isAuthenticated={isAuthenticated}/>
        {isAuthenticated ? 
        <HomePage />
        : <h2>Please Login</h2>
        }
        </>
      );
    }
  }
}

export default withAuth0(App);
