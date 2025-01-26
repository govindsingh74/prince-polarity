const ntpClient = require('ntp-client');
const crypto = require('crypto');
const debug = require('debug')('polarity:clock');

const DEFAULT_TIME_SOURCES = [
  { url: 'time.nist.gov', weight: 1 }, // NIST, USA
  { url: 'time.euro.apple.com', weight: 1 }, // Apple's European Time Server
  { url: 'time.google.com', weight: 1 }, // Google
  { url: 'time.windows.com', weight: 1 }, // Microsoft
  { url: 'clock.isc.org', weight: 1 } // Internet Systems Consortium
];

const DEFAULT_OPTIONS = {
  updateInterval: 1000 * 60, // Update every minute
  minimumSources: 2, // Minimum number of responsive sources required
  timeoutThreshold: 1000 * 2 // 2 second timeout for each source
};

class PolarityClock {
  constructor(sources = DEFAULT_TIME_SOURCES, options = {}) {
    this.sources = [...sources];
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.lastUpdate = 0;
    this.currentTime = Date.now();
    this.timeOffset = 0;
    this.updateInterval = null;
    this.start();
  }

  queryTimeSource(source) {
    return new Promise((resolve, reject) => {
      ntpClient.getNetworkTime(source.url, 123, (err, date) => {
        if (err) {
          debug(`Error querying ${source.url}:`, err);
          reject(err);
          return;
        }
        resolve(date.getTime());
      });
    });
  }

  async updateTime() {
    const responses = [];
    const weights = [];

    const timePromises = this.sources.map(async (source) => {
      try {
        const timestamp = await this.queryTimeSource(source);
        responses.push(timestamp);
        weights.push(source.weight);
        source.lastResponse = Date.now();
      } catch (error) {
        debug(`Failed to get time from ${source.url}`);
      }
    });

    await Promise.all(timePromises);

    if (responses.length < this.options.minimumSources) {
      throw new Error(`Not enough time sources responded (${responses.length}/${this.options.minimumSources})`);
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const weightedTime = responses.reduce((sum, time, i) => {
      return sum + (time * weights[i]);
    }, 0) / totalWeight;

    this.timeOffset = weightedTime - Date.now();
    this.lastUpdate = Date.now();
    debug(`Time updated. Offset: ${this.timeOffset}ms`);
  }

  getCurrentTime() {
    const now = Date.now() + this.timeOffset;
    const timeSinceUpdate = Date.now() - this.lastUpdate;
    const accuracy = Math.min(1, Math.max(0, 1 - (timeSinceUpdate / this.options.updateInterval)));

    return {
      timestamp: now,
      accuracy,
      sources: this.sources.filter(s => s.lastResponse).length
    };
  }

  getTimeHash() {
    const { timestamp } = this.getCurrentTime();
    return crypto
      .createHash('sha256')
      .update(timestamp.toString())
      .digest('hex');
  }

  start() {
    if (this.updateInterval) {
      return;
    }

    this.updateTime().catch(debug);
    this.updateInterval = setInterval(() => {
      this.updateTime().catch(debug);
    }, this.options.updateInterval);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Example usage
const clock = new PolarityClock();

// Get current time
const { timestamp, accuracy, sources } = clock.getCurrentTime();
console.log('Current time:', new Date(timestamp).toISOString());
console.log('Accuracy:', accuracy);
console.log('Active sources:', sources);

// Get time hash for blockchain
console.log('Time hash:', clock.getTimeHash());

module.exports = { PolarityClock };