---
'@backstage/backend-defaults': patch
---

Add `backend.logger` config options to configure the `RootLoggerService`.

The following parameters are available:

- `level` (string, optional): Sets the global log level. Possible values are 'debug', 'info', 'warn', or 'error'. Only messages at or above this level will be logged. This can also be set via the `LOG_LEVEL` environment variable, which takes precedence. Defaults to 'info'.

- `meta` (object, optional): Additional metadata to include with every log entry.

- `overrides` (array, optional): Allows you to specify logger overrides for specific plugins or messages. Each override can match on plugin names, message patterns, or any field contained in the log, and set a custom log level for those matches. The override log level must be higher than the global log level to take effect.

Log level overrides can be helpful to reduce the amount of logs produced by Backstage.
For example, it allows to have a global `info` log level but apply the `warn` level to logs originating from verbose plugins.

Example:

```yaml
backend:
  logger:
    meta:
      env: prod # Every log message will have `env="prod"`

    level: debug # Set the global log level to debug

    overrides:
      # Set the log level to 'warn' for the catalog plugin logs
      - matchers:
          plugin: catalog
        level: warn

      # Ignore logs starting with "Task worker starting", unless they're warnings or errors.
      - matchers:
          message: ['/^Task worker starting/']
        level: warn
```
