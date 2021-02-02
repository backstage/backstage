---
'@backstage/backend-common': patch
---

Updated the `rootLogger` in `@backstage/backend-common` to support custom logging options. This is useful when you want to make some changes without re-implementing the entire logger and calling `setRootLogger` or `logger.configure`. For example you can add additional `defaultMeta` tags to each log entry. The following changes are included:

- Added `createRootLogger` which accepts winston `LoggerOptions`. These options allow overriding the default keys.
- Added an additional error format that can include stack traces. This can be enabled by setting a `LOG_STACKTRACE=true` environment variable. Any `Error` objects passed to `logger.error('message', err)` will include the full stack trace in a `stack` log entry key.

Example Usage:

```ts
// Create the logger
const logger = createRootLogger({
  defaultMeta: { appName: 'backstage', appEnv: 'prod' },
});

// Add a custom logger transport
logger.add(new MyCustomTransport());

const config = await loadBackendConfig({
  argv: process.argv,
  logger: getRootLogger(), // already set to new logger instance
});
```
