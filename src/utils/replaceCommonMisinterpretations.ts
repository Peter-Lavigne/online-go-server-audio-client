// ensure that each word does not partially contain a word before it
const commonMisinterpretations = {
  // number words
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
  'ten': '10',
  'eleven': '11',
  'twelve': '12',
  'thirteen': '13',
  'fourteen': '14',
  'fifteen': '15',
  'sixteen': '16',
  'seventeen': '17',
  'eighteen': '18',
  'nineteen': '19',

  // homonyms
  'won': '1',
  'too': '2',
  'to': '2',
  'ford': '4',
  'for': '4',
  'ate': '8',

  // ordinals
  '1st': '1',
  '2nd': '2',
  '3rd': '3',
  '4th': '4',
  '5th': '5',
  '6th': '6',
  '7th': '7',
  '8th': '8',
  '9th': '9',
  '10th': '10',
  '11th': '11',
  '12th': '12',
  '13th': '13',
  '14th': '14',
  '15th': '15',
  '16th': '16',
  '17th': '17',
  '18th': '18',
  '19th': '19',

  // NATO
  'ciara': 'sierra',
  'juliet': 'juliett',
  'juliettte': 'juliett', // hotfix for "[julie]tte" -> "[juliett]tte"
  'juliettt': 'juliett', // hotfix for "[julie]tt" -> "[juliett]tt"
  'hello': 'kilo',
  'hilo': 'kilo',
  'gulf': 'golf',
  'alpha': 'alfa',
  'julie at': 'juliett',

  // Misc
  'golf18': 'golf 18',
  'kilo-5': 'kilo 5'
}

export function replaceCommonMisinterpretations(words: string) {
  return Object.entries(commonMisinterpretations).reduce((prev, [word, coordinate]) => {
    console.log(prev, word, coordinate);
    return prev.replace(word, coordinate);
  }, words);
}

