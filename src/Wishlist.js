import './Wishlist.css';
import React from 'react';
import { Accordion, Card, Button, Modal, Image, Carousel } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';
import GameFormUpdate from './GameFormUpdate';

class Wishlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // wishlist: this.props.wishlist,
      showModal: false,
      selectedGame: null,
      showModalTwo: false,
      carouselItems: []
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

  handleCloseModalTwo = () => {
    this.setState({
      showModalTwo: false,
    })
  }

  handleShowModalTwo = (screenshots) => {
    this.setState({
      showModalTwo: true,
      carouselItems: screenshots
    })
  }

  render() { 
    let wishlistToRender = this.props.wishlist.map((game, idx) => {
      let imgUrl = game.cover ? `https://images.igdb.com/igdb/image/upload/t_thumb/${game.cover}.jpg` : 'https://images.igdb.com/igdb/image/upload/t_thumb/nocover_qhhlj6.jpg';
      console.log(game);
      let screenshots = game.screenshots ? game.screenshots.map((screenshot, idx) => {
        return <Carousel.Item key={idx} interval={null}><Image key={idx} className="d-block w-100" alt="screenshot" src={`https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${screenshot.image_id}.jpg`} /></Carousel.Item>
      }) : "";
      console.log(screenshots);
      let platforms = game.platforms.map((platform, idx) => platform.name).join(' -- ')

      return <Card key={game._id}>
        <Card.Header className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <Image className="mr-3" thumbnail alt="cover" src={imgUrl} onClick={() => this.handleShowModalTwo(screenshots)} />
            <div>
              <Accordion.Toggle className="p-0" as={Button} variant="link" eventKey={game._id}>
                <h4>{game.title}</h4>
              </Accordion.Toggle>
              <p>{game.releaseDate}</p>
            <div><i>{platforms}</i></div>
            </div>
          </div>
          <Button onClick={() => this.props.handleDelete(game._id)} variant="link" size="sm">Remove</Button>
        </Card.Header>
        <Accordion.Collapse eventKey={game._id}>
          <Card.Body>
            <Card.Title>Summary</Card.Title>
            <Card.Text>
              {game.summary}
            </Card.Text>
            <hr />
            <Card.Title>My comments</Card.Title>
            <Card.Text>
              <i>{game.note}</i>
            </Card.Text>
            <Button variant="info" onClick={() => this.handleShow(game)} >Comment</Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    })

    return (
      <>
        <h1 className="text-center m-3">My Wish List</h1>
        <Accordion>
          {wishlistToRender}
        </Accordion>
        <Modal size="xl" show={this.state.showModalTwo} onHide={this.handleCloseModalTwo}>
          <Modal.Header closeButton>Screenshots
          </Modal.Header>
          <Modal.Body>
            <Carousel>
              {this.state.carouselItems}
            </Carousel>
          </Modal.Body>
        </Modal>
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


