# events-backend-module-gitea

Welcome to the `events-backend-module-gitea` backend module!

This package is a module for the `events-backend` backend plugin
and extends the event system with a signature validator for Gitea webhook events.

Gitea signs webhook requests with an HMAC-SHA256 digest of the payload,
sent with the `X-Gitea-Signature` header.
The validator verifies this signature based on a shared secret
before events get published to the topic `gitea`.

The HTTP ingress for the topic `gitea` is only registered
if the webhook secret is configured.

Please find more information about Gitea webhooks at the
[official documentation](https://docs.gitea.com/usage/webhooks).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-gitea
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend-module-gitea'));
```

## Configuration

```yaml
events:
  modules:
    gitea:
      webhookSecret: your-secret-token
```

Configure your Gitea webhook to send events as `application/json`
to `{backend-url}/api/events/http/gitea`
using the same secret as configured above.
