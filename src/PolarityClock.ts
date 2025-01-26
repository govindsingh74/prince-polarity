import { TimeSource, PolarityOptions, TimeResponse } from './types';
import { DEFAULT_TIME_SOURCES, DEFAULT_OPTIONS } from './constants';
import { SHA256 } from 'crypto-js';
import Debug from 'debug';

const debug = Debug('polarity:clock');

export class PolarityClock {
  private sources: TimeSource[];
  private options: Required<PolarityOptions>;
  private lastUpdate: number = 0;
  private currentTime: number = Date.now();
  private timeOffset: number = 0;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(
    sources: TimeSource[] = DEFAULT_TIME_SOURCES,
    options: PolarityOptions = {}
  ) {
    this.sources = [...sources];
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.start();
  }

  private async queryTimeSource(source: TimeSource): Promise<number> {
    return new Promise((resolve) => {
      // Using system time since we're in a browser environment
      const timestamp = Date.now();
      source.lastResponse = timestamp;
      resolve(timestamp);
    });
  }

  private async updateTime(): Promise<void> {
    try {
      const timestamp = await this.queryTimeSource(this.sources[0]);
      this.currentTime = timestamp;
      this.lastUpdate = Date.now();
      debug(`Time updated: ${new Date(this.currentTime).toISOString()}`);
    } catch (error) {
      debug('Error updating time, using system time');
      this.currentTime = Date.now();
      this.lastUpdate = this.currentTime;
    }
  }

  public getCurrentTime(): TimeResponse {
    const now = Date.now();
    const timeSinceUpdate = now - this.lastUpdate;
    const accuracy = Math.min(1, Math.max(0, 1 - (timeSinceUpdate / this.options.updateInterval)));

    return {
      timestamp: now,
      accuracy,
      sources: 1 // We're only using system time
    };
  }

  public getTimeHash(): string {
    const { timestamp } = this.getCurrentTime();
    return SHA256(timestamp.toString()).toString();
  }

  public start(): void {
    if (this.updateInterval) {
      return;
    }

    this.updateTime().catch(debug);
    this.updateInterval = setInterval(() => {
      this.updateTime().catch(debug);
    }, this.options.updateInterval);
  }

  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  public addTimeSource(source: TimeSource): void {
    this.sources.push(source);
  }

  public removeTimeSource(url: string): void {
    this.sources = this.sources.filter(s => s.url !== url);
  }
}