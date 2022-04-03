import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from "@auth0/auth0-react";

// this was taken from Auth0 provider docs

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      //original domain="dev-kz5f83m7.us.auth0.com"
      domain="dev-1ckj5yxc.us.auth0.com"
      //original clientId="MnA1KYJLjvtjCGuSsWMEZNWFjkfA1IAw"
      clientId="XPQ92Ci9F3sayN2RndU83H5zokzGbhCs"
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
