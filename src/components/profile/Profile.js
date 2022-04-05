import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card } from "react-bootstrap";

// this was taken from auth0.com docs

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const styles = {
    objectFit: 'none'
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div style={{ width: 'fit-content', margin: '0 auto' }}>
        <Card style={{ width: 'auto', marginTop: '1rem' }}>
          <Card.Header>You are logged in as</Card.Header>
          <Card.Img variant="top" src={user.picture} style={styles} />
          <Card.Body>
            <Card.Title>{user.name}</Card.Title>
            <Card.Text>{user.email}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    )
  );
};

export default Profile;