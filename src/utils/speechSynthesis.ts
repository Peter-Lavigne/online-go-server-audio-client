export function speak(utterance: string){
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(utterance);
  utterThis.voice = synth.getVoices().find(v => v.default)!;
  synth.speak(utterThis);
}
