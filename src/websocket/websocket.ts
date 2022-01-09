import { io, Socket } from 'socket.io-client';
import { ogsUrl } from '../utils/ogsUrl';
import { createAutomatchMessage } from './createAutomatchMessage';
import { onAutomatchEntryResponse, onAutomatchStartResponse, onGameDataResponse, onGameMoveResponse, onGameRemovedStonesResponse } from './receivedMessages';

export class OGSSocket {
  socket: Socket;

  constructor() {
    this.socket = io(ogsUrl(), {'transports': ['websocket', 'polling']});
  }

  emitAuthenticate = (
    playerId: number,
    username: string,
    auth: string,
    jwt: string,
  ) => {
    this.socket.emit("authenticate", {
      auth,
      jwt,
      player_id: playerId,
      username,
    })
  }

  emitAutomatch = () => {
    this.socket.emit("automatch/find_match", createAutomatchMessage(2));
  }

  emitGameConnect = (gameId: number) => {
    this.socket.emit('game/connect', {
      game_id: gameId,
    })
  }

  emitGameMove = (gameId: number, move: string, playerId: number) => {
    this.socket.emit('game/move', {
      game_id: gameId,
      move,
      player_id: playerId,
    })
  }

  emitGameResign = (gameId: number, playerId: number) => {
    this.socket.emit('game/resign', {
      "game_id": gameId,
      "player_id": playerId
    });
  }

  emitRemovedStonesAccept = (gameId: number, playerId: number, stones: string) => {
    this.socket.emit('game/removed_stones/accept', {
      "game_id": gameId,
      "player_id": playerId,
      "stones": stones,
      "strict_seki_mode": false
    })
  }

  onAutomatchStart = (callback: (response: onAutomatchStartResponse) => void) => {
    this.socket.on("automatch/start", callback);
  }

  onAutomatchEntry = (callback: (response: onAutomatchEntryResponse) => void) => {
    this.socket.on("automatch/entry", callback);
  }

  onGameData = (gameId: number, callback: (response: onGameDataResponse) => void) => {
    this.socket.on(`game/${gameId}/gamedata`, callback);
  }

  onGameMove = (gameId: number, callback: (response: onGameMoveResponse) => void) => {
    this.socket.on(`game/${gameId}/move`, callback);
  }

  onGameRemovedStones = (gameId: number, callback: (response: onGameRemovedStonesResponse) => void) => {
    this.socket.on(`game/${gameId}/removed_stones`, callback);
  }
}
