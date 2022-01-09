import React, { Component } from 'react';
import { DefaultApi } from '../generated-client-api';
import { ogsUrl } from '../utils/ogsUrl';
import { OGSSocket } from '../websocket/websocket';

interface GameFinderProps {
  client: DefaultApi;
  socket: OGSSocket;
  onGameFound: (gameId: number) => void;
}

interface GameFinderState {
  gameId: number | null,
  error: string | null,
}

export class GameFinder extends Component<GameFinderProps, GameFinderState> {
  constructor(props: GameFinderProps) {
    super(props);
    this.state = {
      gameId: null,
      error: null,
    }
  }

  // createAutomatch = () => {
  //   this.props.socket.onAutomatchStart(({ game_id }) => {
  //     this.props.onGameFound(game_id);
  //   });
  //   this.props.socket.emitAutomatch();
  // }

  // createChallenge = async () => {
  //   const challengesResponse = await this.props.client.challengesPost(createChallengeRequest());
  //   this.props.onGameFound(challengesResponse.game);
  // }

  onInputGameUrl = (url: string) => {
    var matches = url.match(/\d+$/);

    if (matches) {
      this.setState({
        gameId: Number(matches[0])
      });
    } else {
      this.setState({
        error: 'Invalid game URL'
      })
    }
  }

  onClickConnectToGameById = () => {
    if (this.state.gameId === null) return;
    this.props.onGameFound(this.state.gameId);
  }

  render() {
    return (
      <>
        <p>Start a match on <a href={`${ogsUrl()}/play`} target="_blank">OGS</a>, then paste the URL or game ID below.</p>
        <input
          onInput={(e) => this.onInputGameUrl((e.target as HTMLTextAreaElement).value)}
          placeholder={`${ogsUrl()}/game/39521517`}
        />
        {
          this.state.error && (
            <p style={{ color: 'red' }}>Invalid URL.</p>
          )
        }
        <button disabled={this.state.gameId === null} onClick={this.onClickConnectToGameById}>Connect to game</button>
      </>
    )
  }
}
