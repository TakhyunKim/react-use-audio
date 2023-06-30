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

  private resetAudio = () => {
    this.updateAudioData({ isPlaying: false, isPause: false });
  };

  private updateAudioData = (currentAudioData: Partial<AudioData>) => {
    const prevData = this.snapshot.data;
    this.snapshot = {
      ...this.snapshot,
      data: { ...prevData, ...currentAudioData },
    };
    this.emitChange();
  };

  public getSnapshot = () => {
    return this.snapshot;
  };

  private emitChange = () => {
    this.listeners.forEach((listener) => listener());
  };
}
