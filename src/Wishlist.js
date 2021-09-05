import './Wishlist.css';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { withAuth0 } from '@auth0/auth0-react';
import Modal from 'react-bootstrap/Modal';
import GameFormUpdate from './GameFormUpdate';

class Wishlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: this.props.wishlist,
      showModal: false,
      selectedGame: null,
    }
  };
  handleClose = () => {
    this.setState({
      showModal: false,
    })
  }
  handleShow = (game) => {
    this.setState({
      showModal: true,
      selectedGame: game,
    })
  }

  render() {
    let wishlistToRender = this.props.wishlist.map((game, idx) => {
      return <Card key={game._id}>
        <Accordion.Toggle as={Card.Header} eventKey={game._id}>
          <div className="wishlistUpdDelButtons">
            <h4>{game.title}</h4>
            <Button onClick={() => this.props.handleDelete(game._id)} variant="link" size="sm">Remove</Button>
          </div>
          {game.releaseDate}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={game._id}>
          <Card.Body>
            <Card.Title>My notes</Card.Title>
            <Card.Text>{game.note}</Card.Text>
            <Button variant="info" onClick={() => this.handleShow(game)} >Update note</Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    })

    return (
      <>
        <h1>Take a look at upcoming Gaming Odysseys</h1>
        <Accordion>
          {wishlistToRender}
        </Accordion>
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton><h2>Update a Game Note</h2>
          </Modal.Header>
          <Modal.Body>
            {
              this.state.selectedGame ?
                <GameFormUpdate 
                handleClose={this.handleClose} 
                game={this.state.selectedGame} 
                handleUpdate={this.props.handleUpdate} />
                : ''
            }
          </Modal.Body>
        </Modal>
      </>
    )
  }

}

export default withAuth0(Wishlist);


