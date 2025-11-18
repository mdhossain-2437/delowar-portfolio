interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: "chargingchange" | "levelchange", listener: () => void): void;
  removeEventListener(type: "chargingchange" | "levelchange", listener: () => void): void;
}

interface Window {
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

declare var SpeechRecognition: {
  new (): SpeechRecognition;
};

declare module "*.wasm?url" {
  const url: string;
  export default url;
}

declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": any;
  }
}
