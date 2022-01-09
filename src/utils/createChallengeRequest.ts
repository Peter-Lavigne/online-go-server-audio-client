import { ChallengesPostRequest } from "../generated-client-api";

export function createChallengeRequest(): ChallengesPostRequest {
  return { inlineObject: {
    initialized: false,
    minRanking: -1000,
    maxRanking: 1000,
    challengerColor: "automatic",
    game: {
      name: "Test Game",
      rules: "japanese",
      ranked: false,
      width: 19,
      height: 19,
      handicap: 0,
      komiAuto: "automatic",
      komi: null,
      disableAnalysis: false,
      initialState: null,
      _private: false,
      timeControl: "simple",
      timeControlParameters: {
        system: "simple",
        speed: "live",
        perMove: 600,
        pauseOnWeekends: false,
        timeControl: "simple"
      },
      pauseOnWeekends: false
    },
    agaRanked: false
  }}
}