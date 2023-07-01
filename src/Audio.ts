export type AudioData = {
  isPause: boolean;
  isPlaying: boolean;
  name: string;
  audioBufferSourceNode: AudioBufferSourceNode;
};

export type AudioSnapshot = {
  data: AudioData;
  play: () => void;
  stop: () => void;
  pause: () => void;
};

export class AudioController {
  private listeners: Set<() => void>;
  private audioContext: AudioContext;
  private audioBuffer: AudioBuffer | null;
  private audioBufferSourceNode: AudioBufferSourceNode;
  private snapshot: AudioSnapshot;

  constructor() {
    this.listeners = new Set();
    this.audioContext = new AudioContext();
    this.audioBufferSourceNode = this.audioContext.createBufferSource();
    this.audioBuffer = null;
    this.snapshot = {
      data: {
        isPlaying: false,
        isPause: false,
        name: "",
        audioBufferSourceNode: this.audioBufferSourceNode,
      },
      play: () => console.log("play"),
      stop: () => console.log("stop"),
      pause: () => console.log("pause"),
    };
  }

  private updateAudioData = (currentAudioData: Partial<AudioData>) => {
    const prevData = this.snapshot.data;
    this.snapshot = {
      ...this.snapshot,
      data: { ...prevData, ...currentAudioData },
    };
    this.emitChange();
  };

  private resetAudio = () => {
    this.updateAudioData({ isPlaying: false, isPause: false });
  };

  private playAudio = () => {
    /**
     * For an AudioBufferSourceNode, you can only play it the first time.
     * This forces you to create a source Node using createBufferSource each time you want to play it.
     * https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode
     */
    const audioBufferSourceNode = this.audioContext.createBufferSource();
    audioBufferSourceNode.buffer = this.audioBuffer;
    audioBufferSourceNode.connect(this.audioContext.destination);
    audioBufferSourceNode.start();
    this.audioBufferSourceNode = audioBufferSourceNode;
    this.audioBufferSourceNode.addEventListener("ended", this.resetAudio);
  };

  public subscribe = (listener: () => void, audio: string) => {
    this.listeners.add(listener);
    this.updateAudioData({ name: audio });

    fetch(audio)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => (this.audioBuffer = audioBuffer))
      .then(this.emitChange)
      .catch((e) => console.error(e.message));

    return () => {
      this.listeners.delete(listener);
      this.audioBufferSourceNode.disconnect();

      if (this.audioContext.state !== "closed") {
        this.audioContext.close();
      }

      this.audioContext = new AudioContext();
      this.audioBufferSourceNode = this.audioContext.createBufferSource();
      this.audioBuffer = null;

      this.updateAudioData({
        name: "",
        isPause: false,
        isPlaying: false,
        audioBufferSourceNode: this.audioBufferSourceNode,
      });

      this.audioBufferSourceNode.removeEventListener("ended", this.resetAudio);
    };
  };

  public getSnapshot = () => {
    return this.snapshot;
  };

  private emitChange = () => {
    this.listeners.forEach((listener) => listener());
  };
}
