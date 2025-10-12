// Minimal stub for @mediapipe/tasks-vision to avoid bundling the real library
// and to suppress eval/minify warnings during production builds.
// If your code actually needs mediapipe features at runtime, remove this shim
// and use the real package or dynamic import where required.

const noOp = () => {};

export const Vision = {
  ImageSegmenter: class {
    constructor() {}
    setOptions() {}
    segment() {
      return Promise.resolve({});
    }
  },
  ObjectDetector: class {
    constructor() {}
    setOptions() {}
    detect() {
      return Promise.resolve([]);
    }
  },
};

export default {
  Vision,
  version: "stub",
  createWorker: () => ({ postMessage: noOp, onmessage: noOp }),
};
