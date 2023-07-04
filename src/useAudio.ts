import { useRef, useCallback, useSyncExternalStore } from "react";

import { AudioController } from "./Audio";

export const useAudio = (audio: string) => {
  const audioControllerRef = useRef<AudioController | null>(null);

  if (audioControllerRef.current === null) {
    audioControllerRef.current = new AudioController();
  }

  const subscribe = useCallback(
    (listener: () => void) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      audioControllerRef!.current!.subscribe(listener, audio),
    [audio]
  );

  const audioInfo = useSyncExternalStore(
    subscribe,
    audioControllerRef?.current.getSnapshot
  );

  return audioInfo;
};
