export interface onAutomatchEntryResponse {}

export interface onAutomatchStartResponse {
  game_id: number;
  uuid: string;
}

export interface onGameDataResponse {
  white_player_id: number;
  black_player_id: number;
  group_ids: unknown[];
  game_id: number;
  game_name: string;
  private: boolean;
  pause_on_weekends: boolean;
  players: {
      black: {
          username: string;
          rank: number;
          professional: boolean;
          id: number
      };
      white: {
          username: string;
          rank: number;
          professional: boolean;
          id: number
      };
  };
  ranked: boolean;
  disable_analysis: boolean;
  handicap: number;
  komi: number;
  width: number;
  height: number;
  rules: string;
  time_control: {
      system: string;
      speed: string;
      per_move: 3600;
      pause_on_weekends: boolean;
      time_control: string;
  };
  meta_groups: unknown[];
  phase: string;
  initial_player: string;
  moves: unknown[];
  allow_self_capture: boolean;
  automatic_stone_removal: boolean;
  free_handicap_placement: boolean;
  aga_handicap_scoring: boolean;
  allow_ko: boolean;
  allow_superko: true;
  superko_algorithm: string;
  score_territory: true;
  score_territory_in_seki: boolean;
  score_stones: boolean;
  score_handicap: boolean;
  score_prisoners: true;
  score_passes: true;
  white_must_pass_last: boolean;
  opponent_plays_first_after_resume: true;
  strict_seki_mode: boolean;
  initial_state: {
      black: string;
      white: string;
  };
  start_time: number;
  original_disable_analysis: boolean;
  clock: {
      game_id: number;
      current_player: number;
      black_player_id: number;
      white_player_id: number;
      title: string;
      last_move: number;
      expiration: number;
      black_time: number;
      white_time: number;
      start_mode: true
  },
  winner?: number;
}

export interface onGameMoveResponse {
  game_id: number;
  move: {
    0: number;
    1: number;
    2: number;
    3: null;
    4: {
      blur: number,
      sgf_downloaded_by: unknown[]
    };
  }
  blur: number;
  sgf_downloaded_by: unknown[];
  move_number: number;
}

export interface onGameRemovedStonesResponse {
  removed: boolean;
  stones: string;
  all_removed: string;
}
