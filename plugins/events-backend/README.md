# `@backstage/plugin-events-backend`

Welcome to the events-backend backend plugin!

This package is based on [events-node](../events-node) and its `eventsServiceRef`
that is at the core of the event support.
It provides an `eventsPlugin` (exported as `default`).

By default, the plugin ships with support to receive events via HTTP endpoints
`POST /api/events/http/{topic}` and will publish these to the `EventsService`.

HTTP ingresses can be enabled by config, or using the extension point
of the `eventsPlugin`.
Additionally, the latter allows to add a request validator
(e.g., signature verification).

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-events-backend
```

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-events-backend'));
```

## Configuration

In order to create HTTP endpoints to receive events for a certain
topic, you need to add them at your configuration:

```yaml
events:
  http:
    topics:
      - bitbucketCloud
      - github
      - whatever
```

Only those topics added to the configuration will result in
available endpoints.

The example above would result in the following endpoints:

```
POST /api/events/http/bitbucketCloud
POST /api/events/http/github
POST /api/events/http/whatever
```

You may want to use these for webhooks by SCM providers
in combination with suitable event subscribers.

However, it is not limited to these use cases.

## Use Cases

### Request Validator

```ts
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';

// [...]

export const eventsModuleYourFeature = createBackendModule({
  pluginId: 'events',
  moduleId: 'your-feature',
  register(env) {
    // [...]
    env.registerInit({
      deps: {
        // [...]
        events: eventsExtensionPoint,
        // [...]
      },
      async init({ /* ... */ events /*, ... */ }) {
        // [...]
        events.addHttpPostIngress({
          topic: 'your-topic',
          validator: yourValidator,
        });
      },
    });
  },
});
```

### Request Body Parse

We need to parse the request body before we can validate it. We have some default parsers but you can provide your own when necessary.

```ts
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';

// [...]

export const eventsModuleYourFeature = createBackendModule({
  pluginId: 'events',
  moduleId: 'your-feature',
  register(env) {
    // [...]
    env.registerInit({
      deps: {
        // [...]
        events: eventsExtensionPoint,
        // [...]
      },
      async init({ /* ... */ events /*, ... */ }) {
        // [...]
        events.addHttpPostBodyParser({
          contentType: 'application/x-www-form-urlencoded',
          parser: async (req, _topic) => {
            return {
              bodyParsed: req.body.toString('utf-8'),
              bodyBuffer: req.body,
              encoding: 'utf-8',
            };
          },
        });
      },
    });
  },
});
```

We have the following default parsers:

- `application/json`
