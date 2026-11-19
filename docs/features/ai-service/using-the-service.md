---
id: ai-service-using
title: Using the AI Service
sidebar_label: Using the service
description: Open a managed AI harness from a backend plugin, request features, stream answers, and follow sessions over signals
---

This guide is for backend plugin authors who want their plugin to make AI
model calls through the managed service. For the HTTP routes of the AI
plugin itself, see [the routes](#the-http-routes); for scaffolder actions,
the [scaffolder module](#the-scaffolder-module) is already wired.

## Opening a harness

A plugin opens a _harness_ through the AI service. The harness is a
process-local, reference-counted handle: model calls made through it run
through the guarded path — permissions checked with the caller's own
credentials, credentials resolved from the installation's stores, every
decision journaled before dispatch.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { aiServiceRef } from '@backstage/plugin-ai-backend';
import { createRegistry } from './registry';

export default createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        ai: aiServiceRef,
        auth: coreServices.auth,
        config: coreServices.rootConfig,
        http: coreServices.httpRouter,
      },
      async init({ ai, auth, config, http }) {
        // per request, with the caller's credentials:
        const handle = await ai.openHarness({
          sessionId: `${pluginId}:${entityRef}`,
          config: { root: config, path: 'my-plugin.ai' },
          credentials: callerCredentials,
          registry: createRegistry(),
          registryVersion: '1',
          features: [],
        });
        try {
          const conversation = await handle.harness.root(handle.context);
          // ... run the agent ...
        } finally {
          await handle.release();
        }
      },
    });
  },
});
```

The options:

| Option            | Description                                                                                                                                                                  |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sessionId`       | Stable identity of the managed session; journal rows and the audit route are scoped to it.                                                                                   |
| `config`          | The root configuration and the plugin's own agent configuration path. The schema at that path is documented in [Configuration](./configuration.md#per-plugin-configuration). |
| `credentials`     | The caller's Backstage credentials. Every permission query and credential resolution runs as the caller, not as the plugin.                                                  |
| `registry`        | The plugin's own extension registry. The service composes its mediation on top; the plugin's registry is never replaced.                                                     |
| `registryVersion` | Version of the plugin's registry snapshot.                                                                                                                                   |
| `features`        | Features this harness requests: `'tools'`, `'codemode'`, or both. Omitted or empty means a harness with no tool surface and no code-mode globals.                            |

Feature requests are checked against the `ai.feature.use` permission at
admission, with the caller's credentials, and the granted set is frozen
into the admission: re-opening the session with a different declaration is
rejected while handles are held, and a denial names the feature and the
plugin. A plugin that has not been granted a feature simply does not see
it — no tools facade, no code-mode globals.

## The tools facade

A harness granted the `tools` feature exposes `handle.tools`, a fixed
surface of guarded tool operations. Every tool call dispatches through the
same guarded path as model operations — the `ai.tool.use` permission is
checked per attempt, with the dispatching plugin's id attached to the
query so `isPlugin` rules can scope tools per plugin. Tool servers are
registered through the plugin's `aiModulesExtensionPoint` (see
[Extending](./extending.md)).

## Code mode

A harness granted the `codemode` feature can run model-written code in a
sandbox. The extension is built with
`createBoundedCodemodeExtension` from `@backstage/ai-node-codemode/alpha`
and composed into the plugin's own registry; the sandbox is bounded by
time and memory, and code-mode globals are absent unless the feature was
granted.

## The HTTP routes

The AI plugin exposes its own routes under `/api/ai/v1`, all requiring
Backstage user credentials and the `ai.session.use` permission:

- `GET /health` — unauthenticated readiness for infrastructure probes.
- `GET /models` — the models the caller is allowed to use.
- `GET /sessions`, `POST /sessions` — list and create sessions.
- `GET /sessions/:sessionId` — ownership check.
- `POST /sessions/:sessionId/conversations` — create a conversation.
- `GET /sessions/:sessionId/conversations/:conversationId` — recent text
  entries.
- `POST /sessions/:sessionId/conversations/:conversationId/messages` —
  submit content; the response is an SSE stream of `submission`,
  `partial`, `answer`, and `settled` events.
- `GET /sessions/:sessionId/audit` — a session-scoped journal page
  (`ai.audit.read` and ownership required).

## Live observation with signals

Every event the SSE stream carries is also published through the Backstage
signals service on the channel
`ai.session.<sessionId>.<conversationId>`, so the session owner's other
connections — another tab, another device, a frontend component signed in
as the owner — can follow a submission they did not place. Delivery is
gated publish-side: every published signal is addressed to the session
owner alone, so a different user subscribed to the channel receives
nothing.

Signals is live-only, with no replay: a reconnecting observer sees the
future, not the past. Durable outcome observation remains the audit
journal. A submission that settles after its SSE client is gone produces
a notification for the owner through the notifications service instead of
being lost silently.

## The scaffolder module

`@backstage/plugin-scaffolder-backend-module-ai` adds the `ai:generate`
and `ai:transform` actions, which read their agent configuration from
`scaffolder.ai` and request no features — a plugin that later needs tools
declares them in `openHarness` and lets `ai.feature.use` decide:

```ts
backend.add(import('@backstage/plugin-scaffolder-backend-module-ai'));
```

```yaml
scaffolder:
  ai:
    mode: service
    model:
      provider: anthropic
      modelId: claude-sonnet-4-5
    thinkingLevel: medium
```
