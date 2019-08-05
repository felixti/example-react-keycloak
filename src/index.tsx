import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Keycloak from 'keycloak-js'
import { KeycloakProvider } from 'react-keycloak'

const keycloak = Keycloak({
  "realm": process.env.REACT_APP_REALM,
  "url": process.env.REACT_APP_IDENTITY_SERVER_URL,
  "auth-server-url":process.env.REACT_APP_IDENTITY_SERVER_URL,
  "clientId": process.env.REACT_APP_CLIENT_ID,
  "resource": process.env.REACT_APP_CLIENT_ID
})

const onKeycloakEvent = (event: any, error: any) => {
  console.log('onKeycloakEvent', event, error);
  event === 'onAuthLogout' && localStorage.removeItem('kcTokens');
  event === 'onTokenExpired' && updateToken();
}

const onKeycloakTokens = (tokens:any) => {
  console.log({ tokens });
  localStorage.setItem('kcTokens', JSON.stringify(tokens));
}

ReactDOM.render(
      <KeycloakProvider 
        keycloak={keycloak}
        initConfig={{
          onLoad: 'login-required',
          flow: 'implicit'
        }}
        onEvent={onKeycloakEvent}
        onTokens={onKeycloakTokens}>
        <App />
      </KeycloakProvider>, document.getElementById('root'));

const updateToken = (() => {
  keycloak.updateToken(180).success((refreshed) => {
    if (refreshed) {
        console.debug('Token refreshed' + refreshed);
    } else {
        console.warn('Token not refreshed, valid for')
    }
  }).error((err) => {
      console.error('Failed to refresh token: ' + err);
  });
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
