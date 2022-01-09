import React, { Component } from 'react';
import { SpeechInput } from '../utils/speechRecognition';
import { uuid } from '../utils/uuid';
import { OGSSocket } from '../websocket/websocket';

interface GameProps {
  socket: OGSSocket;
  userId: number;
  gameId: number;
}

interface GameState {
  isBlack: boolean | null, // will be null until the game data has loaded
  recentCommands: Array<{
    command: string,
    invalid: boolean,
    key: string,
  }>,
}

const MAX_RECENT_MOVES = 3;

function moveToCoordinates(x: number, y: number) {
  const coords = 'abcdefghijklmnopqrs';
  return `${coords[x]}${coords[y]}`
}

// function moveToString(x: number, y: number): string {
//   return `${NATO['ABCDEFGHJKLMNOPQRST'[x]]} ${19 - y}`;
// }

export class Game extends Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      isBlack: null,
      recentCommands: [],
    }
  }

  componentDidMount() {
    this.props.socket.onGameMove(this.props.gameId, move => {
      if (move.move_number % 2 === (this.state.isBlack ? 0 : 1)) {
        if (move.move[0] === -1 && move.move[1] === -1) {
          this.onOpponentPass();
        } else {
          this.onOpponentMove(move.move[0], move.move[1]);
        }
      }
    });
    this.props.socket.onGameRemovedStones(this.props.gameId, response => {
      this.props.socket.emitRemovedStonesAccept(
        this.props.gameId,
        this.props.userId,
        response.all_removed,
      );
    });
    this.props.socket.onGameData(this.props.gameId, gameData => {
      if (gameData.winner === this.props.userId) {
        this.onWin();
      } else if (gameData.winner) {
        this.onLose();
      }
      this.setState({
        isBlack: gameData.black_player_id === this.props.userId,
      });
    });

    this.props.socket.emitGameConnect(this.props.gameId);

    new SpeechInput(
      this.onCommand,
      this.onPass,
      this.onResign,
      this.onMove,
      this.onInvalidCommand,
    ).start();
  }

  onWin = () => {}

  onLose = () => {}

  onOpponentPass = () => {}

  onOpponentMove = (x: number, y: number) => {}

  onMove = (x: number, y: number) => {
    this.props.socket.emitGameMove(
      this.props.gameId,
      moveToCoordinates(x, y),
      this.props.userId,
    )
  }

  onPass = () => {
    this.props.socket.emitGameMove(
      this.props.gameId,
      '..',
      this.props.userId,
    )
  }

  onResign = () => {
    this.props.socket.emitGameResign(
      this.props.gameId,
      this.props.userId
    )
  }

  onInvalidCommand = () => {
    this.setState({
      recentCommands: [
        ...this.state.recentCommands.slice(0, this.state.recentCommands.length - 1),
        {
          ...this.state.recentCommands[this.state.recentCommands.length - 1]!,
          invalid: true,
        },
      ]
    });
  }

  onCommand = (command: string) => {
    this.setState({
      recentCommands: [
        ...this.state.recentCommands,
        {
          command,
          invalid: false,
          key: uuid(),
        }
      ].slice(
        this.state.recentCommands.length === MAX_RECENT_MOVES ? 1 : 0,
        this.state.recentCommands.length === MAX_RECENT_MOVES ? MAX_RECENT_MOVES + 1 : MAX_RECENT_MOVES
      )
    });
  }

  render() {
    if (this.state.isBlack === null) {
      return <p>Loading game data...</p>
    }

    return (
      <>
        <p>Connected to game.</p>
        <p>Say a <a href="https://en.wikipedia.org/wiki/NATO_phonetic_alphabet#/media/File:FAA_Phonetic_and_Morse_Chart2.svg" target="_blank">NATO alphabet</a> word and a number to make a move at that coordinate. For exmaple, "Delta 4."</p>
        <p>Say "skip" to pass. Say "resign" to resign.</p>
        <p>Most recent commands:</p>
        <ul>
          {
            this.state.recentCommands.map((recentCommand) => {
              if (recentCommand === null) return null;
              const { command, invalid, key } = recentCommand;
              return (
                <li
                  key={key}
                  style={{ color: invalid ? 'red' : 'white' }}
                >
                  {command}
                </li>
              );
            })
          }
        </ul>
        <p><a href="/">Go back</a>.</p>
      </>
    )
  }
}
