import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import { AudioController } from "./Audio";

type MockAudioContext = {
  new (contextOptions?: AudioContextOptions | undefined): AudioContext;
  prototype: AudioContext;
};

const mockingArrayBuffer = jest
  .fn()
  .mockResolvedValue("MOCK_ARRAY_BUFFER" as never) as never;

const mockingCreateBufferSource = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  buffer: undefined,
};

const mockingAudioContext = {
  resume: jest.fn(),
  close: jest.fn(),
  suspend: jest.fn(),
  createBufferSource: jest.fn(() => mockingCreateBufferSource),
  decodeAudioData: jest.fn().mockResolvedValue(mockingArrayBuffer),
  state: "suspended",
  destination: {},
};

describe("Audio Test", () => {
  beforeEach(() => {
    window.fetch = jest
      .fn()
      .mockResolvedValue({ arrayBuffer: mockingArrayBuffer } as never) as (
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ) => Promise<Response>;

    window.AudioContext = jest.fn(
      () => mockingAudioContext
    ) as unknown as MockAudioContext;
  });
  describe("Default method testing", () => {
    describe("Public method testing", () => {
      describe("getSnapshot method", () => {
        test("should return default audio data using getSnapshot", () => {
          // Arrange
          const audioController = new AudioController();
          const expectedData = {
            name: "",
            isPause: false,
            isPlaying: false,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act
          const { data } = audioController.getSnapshot();

          // Assert
          expect(data).toEqual(expectedData);
        });
      });

      describe("subscribe method", () => {
        test("should return updated audio data after the subscribe method is called", () => {
          // Arrange
          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedData = {
            // update name data
            name: mockAudio,
            isPause: false,
            isPlaying: false,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act
          audioController.subscribe(mockListener, mockAudio);
          const { data } = audioController.getSnapshot();

          // Assert
          expect(data).toEqual(expectedData);
          expect(mockListener.mock.calls).toHaveLength(1);
        });

        test("should return initial audio data after subscribe method return method", () => {
          // Arrange
          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedDataWithSubscribe = {
            // update name data
            name: mockAudio,
            isPause: false,
            isPlaying: false,
            audioBufferSourceNode: mockingCreateBufferSource,
          };
          const expectedDataWithUnsubscribe = {
            // reset name data
            name: "",
            isPause: false,
            isPlaying: false,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act - subscribe
          const subscribeCallback = audioController.subscribe(
            mockListener,
            mockAudio
          );
          const { data: subscribeData } = audioController.getSnapshot();

          // Assert - subscribe
          expect(subscribeData).toEqual(expectedDataWithSubscribe);
          expect(mockListener.mock.calls).toHaveLength(1);

          // Act - unsubscribe
          subscribeCallback();
          const { data: unsubscribeData } = audioController.getSnapshot();

          // Assert - unsubscribe
          expect(unsubscribeData).toEqual(expectedDataWithUnsubscribe);
        });
      });
    });

    describe("Private method testing", () => {
      describe("play method", () => {
        test("should return isPlaying data is true when AudioContext state is suspended", () => {
          // Arrange
          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedData = {
            name: mockAudio,
            isPause: false,
            // update isPlaying data
            isPlaying: true,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act
          audioController.subscribe(mockListener, mockAudio);
          const { play } = audioController.getSnapshot();
          play();
          const { data } = audioController.getSnapshot();

          // Assert
          expect(data).toEqual(expectedData);
          expect(mockListener.mock.calls).toHaveLength(2);
        });

        test("should return isPlaying is true when AudioContext state is closed", () => {
          // Arrange
          window.AudioContext = jest.fn(() => ({
            ...mockingAudioContext,
            state: "closed",
          })) as unknown as MockAudioContext;

          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedData = {
            name: mockAudio,
            isPause: false,
            // update isPlaying data
            isPlaying: true,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act
          audioController.subscribe(mockListener, mockAudio);
          const { play } = audioController.getSnapshot();
          play();
          const { data } = audioController.getSnapshot();

          // Assert
          expect(data).toEqual(expectedData);
          expect(mockListener.mock.calls).toHaveLength(2);
        });

        test("should return isPlaying is true when AudioContext state is running", () => {
          // Arrange
          window.AudioContext = jest.fn(() => ({
            ...mockingAudioContext,
            state: "running",
          })) as unknown as MockAudioContext;

          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedData = {
            name: mockAudio,
            isPause: false,
            // update isPlaying data
            isPlaying: true,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act
          audioController.subscribe(mockListener, mockAudio);
          const { play } = audioController.getSnapshot();
          play();
          const { data } = audioController.getSnapshot();

          // Assert
          expect(data).toEqual(expectedData);
          expect(mockListener.mock.calls).toHaveLength(2);
        });
      });

      describe("stop method", () => {
        test("should return isPlaying data is false when stop is executed after play", () => {
          // Arrange
          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedDataWithPlay = {
            name: mockAudio,
            isPause: false,
            // During play, isPlaying is true.
            isPlaying: true,
            audioBufferSourceNode: mockingCreateBufferSource,
          };
          const expectedDataWithStop = {
            name: mockAudio,
            isPause: false,
            // After stop, isPlaying is false.
            isPlaying: false,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act - play
          audioController.subscribe(mockListener, mockAudio);
          const { play } = audioController.getSnapshot();
          play();
          const { data: playData } = audioController.getSnapshot();

          // Assert - play
          expect(playData).toEqual(expectedDataWithPlay);

          // Act - stop
          const { stop } = audioController.getSnapshot();
          stop();
          const { data: stopData } = audioController.getSnapshot();

          // Assert - stop
          expect(stopData).toEqual(expectedDataWithStop);
          expect(mockListener.mock.calls).toHaveLength(3);
        });

        test("should return isPlaying false and call stop method when state is running and stop method called", () => {
          // Arrange
          const mockingStopFn = jest.fn();
          window.AudioContext = jest.fn(() => ({
            ...mockingAudioContext,
            createBufferSource: jest.fn(() => ({
              ...mockingCreateBufferSource,
              // call this function when stop method called with running state
              stop: mockingStopFn,
            })),
            state: "running",
          })) as unknown as MockAudioContext;

          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedData = {
            name: mockAudio,
            isPause: false,
            // After stop, isPlaying is false.
            isPlaying: false,
            audioBufferSourceNode: {
              ...mockingCreateBufferSource,
              stop: mockingStopFn,
            },
          };

          // Act
          audioController.subscribe(mockListener, mockAudio);
          const { play, stop } = audioController.getSnapshot();
          play();
          stop();
          const { data: stopData } = audioController.getSnapshot();

          // Assert
          expect(stopData).toEqual(expectedData);
          expect(mockingStopFn.mock.calls).toHaveLength(1);
        });
      });

      describe("pause method", () => {
        test("should return isPause is true after pause method called", () => {
          // Arrange
          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedDataWithPlay = {
            name: mockAudio,
            isPause: false,
            // During play, isPlaying is true.
            isPlaying: true,
            audioBufferSourceNode: mockingCreateBufferSource,
          };
          const expectedDataWithPause = {
            name: mockAudio,
            // update isPause, isPlaying data
            isPause: true,
            isPlaying: false,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act - play
          audioController.subscribe(mockListener, mockAudio);
          const { play } = audioController.getSnapshot();
          play();
          const { data: playData } = audioController.getSnapshot();

          // Assert - play
          expect(playData).toEqual(expectedDataWithPlay);

          // Act - pause
          const { pause } = audioController.getSnapshot();
          pause();
          const { data: pauseData } = audioController.getSnapshot();

          // Assert - pause
          expect(pauseData).toEqual(expectedDataWithPause);
          expect(mockListener.mock.calls).toHaveLength(3);
        });

        test("should return isPause is true and suspend method call when state is running and pause called", () => {
          // Arrange
          const mockingSuspendFn = jest.fn();
          window.AudioContext = jest.fn(() => ({
            ...mockingAudioContext,
            suspend: mockingSuspendFn,
            state: "running",
          })) as unknown as MockAudioContext;

          const mockAudio = "audio";
          const mockListener = jest.fn();
          const audioController = new AudioController();
          const expectedData = {
            name: mockAudio,
            // update isPause data
            isPause: true,
            isPlaying: false,
            audioBufferSourceNode: mockingCreateBufferSource,
          };

          // Act
          audioController.subscribe(mockListener, mockAudio);
          const { play, pause } = audioController.getSnapshot();
          play();
          pause();
          const { data } = audioController.getSnapshot();

          // Assert
          expect(data).toEqual(expectedData);
          expect(mockingSuspendFn.mock.calls).toHaveLength(1);
        });
      });
    });
  });
});
