import { uuid } from "../utils/uuid"

export const createAutomatchMessage = (rankDiff: number) => {
  return {
    "uuid": uuid(),
    "size_speed_options": [
        {
            "size": "19x19",
            "speed": "live"
        }
    ],
    "lower_rank_diff": rankDiff,
    "upper_rank_diff": rankDiff,
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
  }
}