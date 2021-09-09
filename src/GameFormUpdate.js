import { withAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
class GameFormUpdate extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      _id: this.props.game._id,
      title: this.props.game.title,
      releaseDate: this.props.game.releaseDate,
      note: this.props.game.note,
      email: this.props.auth0.user.email,
      cover: this.props.game.cover,
      summary: this.props.game.summary,
      platforms: this.props.game.platforms,
      screenshots: this.props.game.screenshots
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleUpdate(this.state);
    this.props.handleClose();
  }
  handleNote = (e) => {
    e.preventDefault();
    this.setState({
      note: e.target.value
    })
  }
  render() {
    return(
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <Form.Label></Form.Label>
          <Form.Group controlId="note">
            <Form.Control type='text' onChange={this.handleNote} value={this.state.note} autoComplete="off"/>
          </Form.Group>
          <Button type='submit'>Update</Button>
        </Form>
      </Container>
    )
  }
}
export default withAuth0(GameFormUpdate);
