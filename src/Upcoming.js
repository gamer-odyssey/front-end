import React from "react";
import { Button, Spinner, ListGroup, Col, Row } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';

class Upcoming extends React.Component {

  render() {
    const { isAuthenticated } = this.props.auth0;

    let comingSoonToRender = this.props.comingSoon.map((game, idx) => {
      let timestamp = game.first_release_date * 1000;
      let dateObject = new Date(timestamp);
      let dateHuman = `${dateObject.toLocaleString('default', { month: 'short' })} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
      let imgUrl = game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg` : 'https://images.igdb.com/igdb/image/upload/t_cover_small_2x/nocover_qhhlj6.jpg';
      let platforms = game.platforms.map((platform, idx) => <li className="platformsLi" key={idx}>{platform.name}</li>);
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
          <Col xs="3" sm="3" md="2" lg="2" xl="2" className="mb-2" style={{minWidth: "200px"}}>
            <img alt="cover" src={imgUrl} />
          </Col>
          <Col xs={true} sm="3" md="2" lg="2" xl="2" style={{minWidth: "fit-content"}}>
            <ul className="platformsUl">
              <h5>Platforms</h5>
              {platforms}
            </ul>
          </Col>
          <Col xs="auto" sm="auto" md={true} lg={true} xl="7" >
            <h5>Summary:</h5>
            <p>{game.summary}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    })   

    return (
      <>
        <h1>Welcome to The Gaming Odyssey</h1>
        <p>Here, you can look through all of the upcoming video games and add them to your personal wish list</p>
        {/* <Button onClick={this.getComingSoon} variant="success">Show Upcoming!</Button> */}
        {
          this.props.comingSoon.length !== 0 ?
            <>
              <div className="text-right">
                {this.props.finishedLoading ? '' : <Spinner animation="border" variant="success" size="sm" />}
                {' '}
                <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.props.previousPage} disabled={this.props.offset > 0 ? false : true} >Previous Page</Button>
                {' '}
                <Button variant="link" style={{ marginBottom: "5px" }} onClick={this.props.nextPage}>Next Page</Button>
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
            : <div style={{ textAlign: "center" }}><Spinner animation="border" variant="success" /></div>
        }
      </>
    )
  }
}

export default withAuth0(Upcoming);

