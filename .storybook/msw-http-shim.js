// MSW v2 http compatibility shim for @vitest/mocker
// This provides MSW v2 http exports using MSW v1 APIs

try {
  // Try to import from MSW v1
  const { rest } = require('msw');

  // Export MSW v1 'rest' as MSW v2 'http' for @vitest/mocker compatibility
  module.exports = {
    http: rest,
    // Provide individual methods that @vitest/mocker might expect
    get: rest.get,
    post: rest.post,
    put: rest.put,
    delete: rest.delete,
    patch: rest.patch,
    head: rest.head,
    options: rest.options,
    all: rest.all,
  };
} catch (error) {
  // Fallback if MSW is not available
  console.warn(
    'MSW not available, providing minimal http mock for @vitest/mocker compatibility',
  );
  const noop = () => {};
  module.exports = {
    http: {
      get: noop,
      post: noop,
      put: noop,
      delete: noop,
      patch: noop,
      head: noop,
      options: noop,
      all: noop,
    },
    get: noop,
    post: noop,
    put: noop,
    delete: noop,
    patch: noop,
    head: noop,
    options: noop,
    all: noop,
  };
}
