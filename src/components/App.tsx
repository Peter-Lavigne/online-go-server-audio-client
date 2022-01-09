import React, { Component } from 'react';
import '../stylesheets/App.css';
// @ts-ignore
import { JSO, Fetcher } from 'jso';
import { Configuration, DefaultApi, InlineResponse2001 as Config } from '../generated-client-api';
import { Game } from './Game';
import { OGSSocket } from '../websocket/websocket';
import { ogsUrl } from '../utils/ogsUrl';
import { GameFinder } from './GameFinder';
import { redirectUri } from '../utils/redirectUri';
import { clientId } from '../utils/clientId';

async function createApiClient() {
  let client = new JSO({
    providerID: 'OGS',
    client_id: clientId(),
    authorization: `${ogsUrl()}/oauth2/authorize`,
    redirect_uri: redirectUri(),
    response_type: 'token',
  });
  client.callback();
  await client.getToken();
  let f = new Fetcher(client);
  return new DefaultApi(new Configuration({
    basePath: `${ogsUrl()}/api/v1`,
    fetchApi: (...args: any[]) => f.fetch(...args)
  }));
}

async function createSocket(config: Config) {
  const socket = new OGSSocket();
  socket.emitAuthenticate(
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
  error: string | null;
  config: Config | null;
  gameId: number | null;
}

function wrapWithApp(component: JSX.Element) {
  return (
    <div className="App">
      <h1>Online Go Server Voice Client</h1>
      {component}
    </div>
  )
}

function gameIdQueryParam() {
  const gameId = new URLSearchParams(window.location.search).get('gameId');
  return gameId !== null ? Number(gameId) : null;
}

class App extends Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      client: null,
      socket: null,
      error: null,
      config: null,
      gameId: null,
    }
  }

  componentDidMount() {
    try {
      // @ts-ignore
      // eslint-disable-next-line
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    } catch (_e) {
      this.setState({
        error: 'Speech recognition is only supported on Chrome browsers for desktop and Android. Please switch to one of those browsers to use this app.'
      });
      return;
    }

    createApiClient().then(client => {
      client.uiConfigGet().then(config => {
        createSocket(config).then(socket => {
          this.setState({
            client,
            socket,
            config,
            gameId: gameIdQueryParam(),
          })
        });
      });
    }).catch(_e => {
      this.setState({
        error: 'Error loading client.',
      })
    });
  }

  onGameFound = (gameId: number) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('gameId', String(gameId));
    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    window.history.pushState(null, '', newRelativePathQuery);

    this.setState({ gameId });
  }

  render() {
    if (this.state.error) {
      return wrapWithApp(<p>{this.state.error}</p>)
    }

    if (
      this.state.client === null ||
      this.state.socket === null ||
      this.state.config === null
    ) {
      return wrapWithApp(<p>Loading client...</p>)
    }

    if (this.state.gameId === null) {
      return wrapWithApp(
        <GameFinder
          client={this.state.client}
          socket={this.state.socket}
          onGameFound={this.onGameFound}
        />
      );
    }

    return wrapWithApp(
      <Game
        socket={this.state.socket}
        gameId={this.state.gameId}
        userId={this.state.config.user.id}
      />
    );
  }
}

export default App;
