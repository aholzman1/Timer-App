// Text-to-speech utility using Web Speech API
const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

export function speak(text: string): void {
  if (!synth) return;

  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  synth.speak(utterance);
}

export function cancel(): void {
  if (synth) {
    synth.cancel();
  }
}
