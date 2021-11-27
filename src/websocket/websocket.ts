import { io, Socket } from 'socket.io-client';
import { ogsUrl } from '../utils/ogsUrl';

// copied from the online-go.com uuid function
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class OGSSocket {
  socket: Socket;

  constructor() {
    this.socket = io(ogsUrl(), {'transports': ['websocket', 'polling']});
  }

  authenticate(
    playerId: number,
    username: string,
    auth: string,
    jwt: string,
  ) {
    this.socket.emit("authenticate", {
      auth,
      jwt,
      player_id: playerId,
      username,
    })
  }

  automatch() {
    this.socket.emit("automatch/find_match", {
      "uuid": uuid(),
      "size_speed_options": [
          {
              "size": "19x19",
              "speed": "live"
          }
      ],
      "lower_rank_diff": 8, // todo: use +/- 2 instead
      "upper_rank_diff": 8,
      "rules": {
          "condition": "required",
          "value": "japanese"
      },
      "time_control": {
          "condition": "required",
          "value": {
              "system": "byoyomi"
          }
      },
      "handicap": {
          "condition": "required",
          "value": "disabled"
      }
    })
  }
}
