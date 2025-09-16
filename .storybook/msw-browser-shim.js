// MSW v2 browser compatibility shim for @vitest/mocker
// This provides MSW v2 exports using MSW v1 APIs to maintain compatibility
// while keeping the rest of the monorepo on MSW v1

try {
  // Try to import from MSW v1
  const { setupWorker, rest } = require('msw');

  // Export in MSW v2 format expected by @vitest/mocker
  module.exports = {
    setupWorker,
    // MSW v2 uses 'http' instead of 'rest', but we provide both for compatibility
    http: rest,
    rest, // Keep rest for any MSW v1 code
  };
} catch (error) {
  // Fallback if MSW is not available - provide minimal mock
  console.warn(
    'MSW not available, providing minimal mock for @vitest/mocker compatibility',
  );
  module.exports = {
    setupWorker: () => ({
      start: () => Promise.resolve(),
      stop: () => {},
      use: () => {},
      resetHandlers: () => {},
    }),
    http: {
      get: () => {},
      post: () => {},
      put: () => {},
      delete: () => {},
      patch: () => {},
      head: () => {},
      options: () => {},
    },
    rest: {
      get: () => {},
      post: () => {},
      put: () => {},
      delete: () => {},
      patch: () => {},
      head: () => {},
      options: () => {},
    },
  };
}
