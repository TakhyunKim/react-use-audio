# react-use-audio

### A React Hook for Easily Handle Sound

- ⭐️ With Typescript
- 🚀 Declarative Hooks API
- 🛠 Using [Audio Web API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

You can easily play, pause, and stop sounds with React Hooks.

## Installation

using **yarn**

```bash
yarn add react-use-audio
```

using **NPM**

```bash
npm install react-use-audio
```

## Usage

### Play sound with onClick Event

```tsx
import { useAudio } from "react-use-audio";

// You need to add sound-related files
import testSound from "../sounds/test.mp3";

function App() {
  const { play } = useAudio(testSound);

  return <button onClick={play}>start</button>;
}

export default App;
```

### Play, Pause, Stop sound with onClick Event

```tsx
import { useAudio } from "react-use-audio";

// You need to add sound-related files
import testSound from "../sounds/test.mp3";

function App() {
  const { play, stop, pause } = useAudio(testSound);

  return (
    <>
      <button onClick={play}>start</button>
      <button onClick={pause}>pause</button>
      <button onClick={stop}>stop</button>
    </>
  );
}

export default App;
```

### Check if the sound is paused or playing

```tsx
import { useAudio } from "react-use-audio";

// You need to add sound-related files
import testSound from "../sounds/test.mp3";

function App() {
  const { data, play, stop, pause } = useAudio(testSound);

  return (
    <>
      <button onClick={play}>start</button>
      <button onClick={pause}>pause</button>
      <button onClick={stop}>stop</button>
      <div>is pause: {data.isPause ? "true" : "false"}</div>
      <div>is play: {data.isPlaying ? "true" : "false"}</div>
    </>
  );
}

export default App;
```

## If the path to mp3 is not found in CRA and typescript environment

Add audio.d.ts under the src directory and add the code below.

```ts
declare module "*.mp3";
declare module "*.wav";
```
