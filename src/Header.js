import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav, } from 'react-bootstrap';
// import { Link } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <Navbar bg="secondary" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand href='/'>The Gaming Odyssey</Navbar.Brand>
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/odyssey">Odysseys</Nav.Link>
            <Nav.Link href="/about-us">About Us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
  }
}

export default Header;
