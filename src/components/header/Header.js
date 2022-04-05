import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav, } from 'react-bootstrap';
import LoginButton from '../loginButtons/LoginButton';
import LogoutButton from '../loginButtons/LogoutButton';

class Header extends React.Component {
  render() {
    return (
      <Navbar bg="secondary" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand href='/'>
              <img
                alt=""
                src="./logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              The Gamer Odyssey</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/odyssey">Favorites</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>
                <Nav.Link href="/about-us">About Us</Nav.Link>
                <div className="login-button-box">
                  {this.props.isLoading
                    ? ""
                    : this.props.isAuthenticated ?
                      <LogoutButton />
                      : <LoginButton />}
                </div>
              </Nav>
            </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default Header;
