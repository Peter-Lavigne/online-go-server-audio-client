import { NATO } from "./nato";
import { replaceCommonMisinterpretations } from "./replaceCommonMisinterpretations";

const INVALID_MOVE_ERROR = new Error('Invalid move');

function parseMove(move: string) {
  let [x, y] = replaceCommonMisinterpretations(move)
    .split(' ')
    .slice(-2);

  if (x === undefined || y === undefined) {
    throw INVALID_MOVE_ERROR;
  }

  const natoIndex = Object.values(NATO).indexOf(x.toLowerCase());
  if (natoIndex === -1) {
    throw INVALID_MOVE_ERROR;
  }
  const xIndex = natoIndex < 8 ? natoIndex : natoIndex - 1;

  const yIndex = 19 - Number(y);
  if (Number.isNaN(yIndex)) {
    throw INVALID_MOVE_ERROR;
  }
  return [xIndex, yIndex];
}

export class SpeechInput {
  constructor(
    private onCommand: (command: string) => void,
    private onPass: () => void,
    private onResign: () => void,
    private onMove: (x: number, y: number) => void,
    private onInvalidCommand: () => void,
  ) {}

  start = () => {
    // @ts-ignore
    // eslint-disable-next-line
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.start();

    recognition.onresult = this.onresult;
    recognition.onend = this.onend;
  }

  onresult = (event: any) => {
    var speechResult = (event
      .results[event.results.length - 1][0]
      .transcript as string)
      .toLowerCase()
      .trim();

    this.onCommand(speechResult);

    if (speechResult === 'skip') {
      this.onPass();
      return;
    } else if (speechResult === 'resign') {
      this.onResign();
      return;
    }

    try {
      const [x, y] = parseMove(speechResult)
      this.onMove(x, y);
    } catch (_e) {
      this.onInvalidCommand();
    }
  }

  onend = () => {
    this.start();
  }
}
