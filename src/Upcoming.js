import React from "react";
import { Button, Spinner, ListGroup, Col, Row, InputGroup, Form, Modal, Carousel, Image } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';

class Upcoming extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      carouselItems: []
    }
  };

  handleClose = () => {
    this.setState({
      showModal: false,
    })
  }
  handleShow = (screenshots) => {
    this.setState({
      showModal: true,
      carouselItems: screenshots
    })
  }

  render() {
    const { isAuthenticated } = this.props.auth0;

    let comingSoonToRender = this.props.comingSoon.map((game, idx) => {
      let timestamp = game.first_release_date * 1000;
      let dateObject = new Date(timestamp);
      let dateHuman = `${dateObject.toLocaleString('default', { month: 'short' })} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
      let imgUrl = game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg` : 'https://images.igdb.com/igdb/image/upload/t_cover_small_2x/nocover_qhhlj6.jpg';
      let platforms = game.platforms.map((platform, idx) => <li className="platformsLi" key={idx}>{platform.name}</li>);
      let screenshots = game.screenshots ? game.screenshots.map((screenshot, idx) => {
        return <Carousel.Item key={idx} interval={null}><Image key={idx} className="d-block w-100" alt="screenshot" src={`https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${screenshot.image_id}.jpg`} /></Carousel.Item>
      }) : "";
      let match = this.props.wishlist.filter(wishlistGame => wishlistGame.title === game.name);

      return <ListGroup.Item key={idx}>
        <Row className="d-flex justify-content-between" xs="2">
          <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto">
            <h4>{game.name}</h4>
            <p>Release date: {dateHuman}</p>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto">{isAuthenticated ?
            <>
              {match.length > 0 ?
                <Button variant="link" disabled>In your wishlist</Button>
                : <Button variant="outline-success" onClick={() => this.props.handleNewGame(game)}>Add to wishlist</Button>}
            </>
            : <Button variant="link" disabled>Sign in to add to wishlist</Button>}
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="3" md="2" lg="2" xl="2" className="mb-2 text-center" style={{ minWidth: "200px" }}>
            <Image rounded className="mt-2 d-block coverimg" alt="cover" src={imgUrl} onClick={() => this.handleShow(screenshots)} />
          </Col>
          <Col xs={true} sm="3" md="2" lg="2" xl="2" style={{ minWidth: "fit-content" }}>
            <ul className="platformsUl">
              <h5>Platforms</h5>
              {platforms}
            </ul>
          </Col>
          <Col className="d-none d-sm-block" sm="auto" md={true} lg={true} xl="7" >
            <h5>Summary:</h5>
            <p>{game.summary}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    })

    return (
      <>
        <h1>Welcome to The Gamer Odyssey!</h1>
        <p>See info about upcoming video games sorted by date. <br /> Checkout out game screenshots by clicking the thumbnail</p>
        <p>Found something you like? Sign in and add it to your personal wish list</p>

        <Modal size="xl" centered animation={false} show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton >SCREENSHOTS </Modal.Header>
          <Modal.Body>
            <Carousel>
              {this.state.carouselItems}
            </Carousel>
          </Modal.Body>
        </Modal>
        <Form className="mb-4 mt-4" onSubmit={this.props.handleSubmit}>
          <InputGroup>
            <Form.Control
              size="md"
              className="input"
              placeholder="Search..."
              onChange={this.props.handleChange}>
            </Form.Control>
            <InputGroup.Append>
              <Button variant="primary" type="submit">Search for Upcoming</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>

        {this.props.comingSoon.length !== 0 ?
          <>
            <div className="text-center">
              <Button onClick={this.props.handleShowAll} variant="success">Show All Upcoming Games</Button>
            </div>
            <div className="text-right">
              {this.props.finishedLoading ? '' : <Spinner animation="border" variant="success" size="sm" />}
              {' '}
              <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.props.previousPage} disabled={this.props.offset > 0 ? false : true} >Previous Page</Button>
              {' '}
              <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.props.nextPage} disabled={this.props.comingSoon.length < 10 ? true : false} >Next Page</Button>
            </div>
            <ListGroup>
              {comingSoonToRender}
            </ListGroup>
            <div className="text-right">
              <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.props.previousPage} disabled={this.props.offset > 0 ? false : true} >Previous Page</Button>
              {' '}
              <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.props.nextPage}>Next Page</Button>
            </div>
          </>
          : this.props.returnedEmptySearch === false
            ? <div style={{ textAlign: "center" }}><Spinner animation="border" variant="success" /></div>
            : <h5>Search returned empty. Check your spelling or search for a different game</h5>}
      </>
    )
  }
}

export default withAuth0(Upcoming);

