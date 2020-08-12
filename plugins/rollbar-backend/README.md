# Rollbar Backend

Simple plugin that proxies requests to the [Rollbar](https://rollbar.com) API.

## Setup

The following values are read from the configuration file.

```yaml
rollbar:
  organization: spotify
  accountToken:
    $secret:
      env: ROLLBAR_ACCOUNT_TOKEN
```

_NOTE: The `ROLLBAR_ACCOUNT_TOKEN` environment variable must be set to a read
access account token._

## Links

- (Frontend part of the plugin)[https://github.com/spotify/backstage/tree/master/plugins/rollbar]
- (The Backstage homepage)[https://backstage.io]
