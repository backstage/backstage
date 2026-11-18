# AI backend

The AI backend exposes managed AI sessions under `/api/ai/v1`.

## Installation

```shell
yarn add --cwd packages/backend @backstage/plugin-ai-backend
```

```ts
backend.add(import('@backstage/plugin-ai-backend'));
```

Configure the installation's models and credentials under `ai` using the
`@backstage/ai-node` configuration schema.

The plugin pre-registers the six stock provider families
(`@backstage/ai-node-provider-google`, `-openai`, `-anthropic`, `-azure`,
`-typesafe`, and `-openrouter`) in its composed default, so the stock
providers need no service factory override.

To add modules beyond the stock families, use the `aiModulesExtensionPoint`
shown below — it is the normal additive path and keeps the stock families
and every other registration intact. Replacing the AI service factory is
the exceptional path for hosts that want full control of the composition:
the factory override's registrations are the complete set, replacing both
the stock families and any dynamic registrations.

Backend modules for the `ai` plugin can register provider and tool modules through `aiModulesExtensionPoint` from `@backstage/plugin-ai-backend/alpha`:

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { aiModulesExtensionPoint } from '@backstage/plugin-ai-backend/alpha';
import { providerModule } from './providerModule';

export default createBackendModule({
  pluginId: 'ai',
  moduleId: 'my-provider',
  register(env) {
    env.registerInit({
      deps: { modules: aiModulesExtensionPoint },
      async init({ modules }) {
        modules.registerProviderModules([providerModule]);
      },
    });
  },
});
```

New admissions use the latest registrations. A live session retains its module snapshot until all its handles are released. Custom AI service factories use their own registrations and do not consume this extension point.

Routes require Backstage user bearer credentials and the `ai.session.use` permission. This plugin does not enable cookie authentication. Model discovery returns only the models the caller is allowed to use under the fixed `ai.model.use` permission, evaluating the policy's `isModel`, `isProvider` and `isModelType` conditions against each cataloged pair; dispatch checks that permission again with the caller's own credentials. Tool dispatch is checked against `ai.tool.use` with the `isTool` and `isServer` conditions, inside the guarded tool operations rather than in plugin wiring. Audit reads require both session ownership and `ai.audit.read`.

- `GET /models` lists permitted models.
- `GET /sessions` lists the caller's sessions; pass the returned `nextCursor` as `cursor` to continue. The optional `limit` is a positive integer and is capped at 500.
- `POST /sessions` accepts `{ "model": { "provider": "...", "modelId": "..." } }` and returns a session and root conversation ID.
- `GET /sessions/:sessionId` returns `{ "sessionId": "..." }` for an owned session and returns 404 if it is unknown or owned by someone else. No additional session metadata is available.
- `POST /sessions/:sessionId/conversations` accepts the same model object and creates a conversation.
- `GET /sessions/:sessionId/conversations/:conversationId` returns up to 100 recent text entries. `hasMore` indicates additional history; pagination of conversation history is not yet supported.
- `POST /sessions/:sessionId/conversations/:conversationId/messages` accepts `{ "content": "..." }` and returns an SSE stream. `partial` events contain text snapshots, `answer` contains the final answer, and `settled` reports the submission status, not an individual provider attempt outcome.
- `GET /sessions/:sessionId/audit` returns a session-scoped journal page. Pass `nextCursor` as `cursor` to continue; malformed cursors return 400.

Live output follows the submission; durable outcome observation requires the audit-read entitlement. A disconnected client stops receiving SSE; the admitted submission continues and settles. Reconnection without audit permission and selective cancellation of an already placed submission are not supported. Journal outcomes are session-scoped and cannot yet be attributed to individual submissions.

The backend's managed service and database are plugin-scoped. Other
consuming plugins use their own instances; installation configuration
supplies the same organization credentials and model catalog to each, but
user-scope encrypted personal credentials are stored per plugin instance —
a user's personal credentials saved through this backend are not shared
with another plugin's instance. Cross-plugin credential and journal hosting
is not available.
