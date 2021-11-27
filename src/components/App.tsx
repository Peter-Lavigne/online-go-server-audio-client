import React, { Component } from 'react';
import '../stylesheets/App.css';

// @ts-ignore
import { JSO, Fetcher } from 'jso';
import { Configuration, DefaultApi } from '../generated-client-api';
import { AudioGo } from './AudioGo';
import { OGSSocket } from '../websocket/websocket';
import { ogsUrl } from '../utils/ogsUrl';

const CLIENT_ID = "oAQYkbAc4qdkYHDEDjN1RSbKyXXL2KtRaWWnJ8kp";

async function createApiClient() {
  let client = new JSO({
    providerID: 'OGS',
    client_id: CLIENT_ID,
    authorization: `${ogsUrl()}/oauth2/authorize`,
    redirect_uri: 'http://localhost:3000/',
    response_type: 'token',
  });
  client.callback();
  await client.getToken();
  let f = new Fetcher(client);
  return new DefaultApi(new Configuration({
    fetchApi: (...args: any[]) => f.fetch(...args)
  }));
}

async function createSocket(client: DefaultApi) {
  const config = await client.uiConfigGet();
  const socket = new OGSSocket();
  socket.authenticate(
    config.user.id,
    config.user.username,
    config.chatAuth,
    config.userJwt
  );
  return socket;
}

interface AppState {
  client: DefaultApi | null;
  socket: OGSSocket | null;
  error: boolean;
}

function wrapWithApp(component: JSX.Element) {
  return <div className="App">{component}</div>
}

class App extends Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      client: null,
      socket: null,
      error: false,
    }
  }

  componentDidMount() {
    createApiClient().then((client) => {
      createSocket(client).then(socket => {
        this.setState({
          client,
          socket
        })
      });
    }).catch(_e => {
      this.setState({
        error: true,
      })
    });
  }

  render() {
    if (this.state.error) {
      return wrapWithApp(<p>Error loading client</p>)
    }

    if (this.state.client === null || this.state.socket === null) {
      return wrapWithApp(<p>Loading client...</p>)
    }

    return wrapWithApp(
      <AudioGo
        client={this.state.client}
        socket={this.state.socket}
      />
    );
  }
}

export default App;
