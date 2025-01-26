// Define the TimeSource interface
interface TimeSource {
  url: string;
  weight: number;
}

// List of trusted NTP servers from government institutions
export const DEFAULT_TIME_SOURCES: TimeSource[] = [
  { url: 'time.nist.gov', weight: 1 }, // NIST, USA
  { url: 'time.euro.apple.com', weight: 1 }, // Apple's European Time Server
  { url: 'ntp.nasa.gov', weight: 1 }, // NASA
  { url: 'time.google.com', weight: 1 }, // Google
  { url: 'ntp1.nl.net', weight: 1 }, // Netherlands
  { url: 'ntp.nict.jp', weight: 1 }, // Japan
  { url: 'time.windows.com', weight: 1 }, // Microsoft
  { url: 'clock.isc.org', weight: 1 }, // Internet Systems Consortium
  { url: 'ntp2.rwth-aachen.de', weight: 1 }, // German University
  { url: 'ntp.cs.strath.ac.uk', weight: 1 }, // University of Strathclyde, UK
  // Additional trusted sources can be added here
];

export const DEFAULT_OPTIONS = {
  updateInterval: 1000 * 60, // Update every minute
  minimumSources: 5, // Minimum number of responsive sources required
  timeoutThreshold: 1000 * 2 // 2 second timeout for each source
};