# Polarity Clock

A secure and accurate blockchain-compatible clock system that provides coordinated universal time by aggregating multiple trusted time sources.

## Features

- Synchronized with multiple trusted government NTP servers
- Weighted average time calculation
- Blockchain-compatible time hashing
- Built-in accuracy monitoring
- Easy integration with any blockchain project
- Automatic time drift correction
- Configurable update intervals
- Minimum source requirements for enhanced reliability

## Installation

```bash
npm install polarity-clock
```

## Usage

Basic usage:

```typescript
import { PolarityClock } from 'polarity-clock';

// Create a new instance with default settings
const clock = new PolarityClock();

// Get current time
const { timestamp, accuracy, sources } = clock.getCurrentTime();

// Get time hash for blockchain
const timeHash = clock.getTimeHash();
```

For blockchain integration, see the example in `examples/blockchain-example.ts`.

## Configuration

You can customize the clock behavior:

```typescript
const clock = new PolarityClock(
  // Custom time sources
  [
    { url: 'time.nist.gov', weight: 1 },
    { url: 'your.custom.timeserver.com', weight: 1 }
  ],
  // Options
  {
    updateInterval: 60000, // Update every minute
    minimumSources: 5, // Minimum required sources
    timeoutThreshold: 2000 // 2 second timeout
  }
);
```

## Security

- Multiple time sources prevent manipulation
- Cryptographic hashing for blockchain integration
- Automatic detection of outlier time sources
- Weighted average calculation reduces impact of compromised sources

## License

MIT