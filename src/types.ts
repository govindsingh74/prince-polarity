export interface TimeSource {
  url: string;
  weight: number;
  lastResponse?: number;
}

export interface PolarityOptions {
  updateInterval?: number; // milliseconds
  minimumSources?: number;
  timeoutThreshold?: number; // milliseconds
}

export interface TimeResponse {
  timestamp: number;
  accuracy: number;
  sources: number;
}