import React, { Component } from 'react';
import { DefaultApi } from '../generated-client-api';
import { OGSSocket } from '../websocket/websocket';

interface AudioGoProps {
  client: DefaultApi;
  socket: OGSSocket;
}

interface AudioGoState {}

export class AudioGo extends Component<AudioGoProps, AudioGoState> {
  constructor(props: AudioGoProps) {
    super(props);
    this.state = {}
  }

  findGame = () => {
    this.props.socket.automatch();
  }

  render() {
    return (
      <button onClick={this.findGame}>Find game</button>
    )
  }
}
