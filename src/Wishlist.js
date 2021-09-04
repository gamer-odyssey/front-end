import './Wishlist.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
class Wishlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: this.props.wishlist
    }
  };

  render() {    
    let wishlistToRender = this.props.wishlist.map((game, idx) => {
      return <Card key={game._id}>
        <Accordion.Toggle as={Card.Header} eventKey={`${idx}`}>
          <div className="wishlistUpdDelButtons">
            <h4>{game.title}</h4>
            <Button variant="link" size="sm">Remove</Button>
          </div>
          {game.releaseDate}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`${idx}`}>
          <Card.Body>
            <Card.Title>My notes</Card.Title>
            <Card.Text>{game.note}</Card.Text>
            <Button variant="info">Update note</Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    })

    return (
      <Container>
        <h1>Take a look at upcoming Gaming Odysseys</h1>
        <Accordion>
          {wishlistToRender}
        </Accordion>
      </Container>
    )
  }

}

export default Wishlist;