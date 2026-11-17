# @backstage/ai-node

Managed, low-level AI service primitives for Backstage backend plugins, built
on the [Pi Durable](https://github.com/earendil-works/pi) execution engine.

> **Status: Wave 0 scaffold.** The service surface here is alpha and coupled
> to the experimental `@earendil-works/pi-durable` engine (pinned to
> `1.5.2`). Production `openHarness` calls fail closed until the Wave 1
> storage, lease, and model-operation guard integration lands. Nothing in
> this package should yet be treated as production security or durability.

## Overview

The managed AI service gives backend plugins a **managed, low-level Pi
Durable primitive**: plugins build their own agents with native Pi
operations, while the service owns host integration — configuration, caller
identity, session ownership, persistence, and lifecycle.

A consuming plugin:

- chooses **where its AI configuration lives** in app-config — there is no
  required `ai.*` or `<pluginId>.ai` path — and passes the root config plus
  that path to `openHarness`;
- supplies a **stable, reproducible registry** and a registry version;
- passes the **original authenticated Backstage credentials** of the caller.

`openHarness` acquires a reference-counted handle to a process-local shared
harness for the `(pluginId, sessionId)` namespace. Releasing a handle never
cancels admitted durable work, and the mediated harness view exposes native
Pi operations without `close`.

## Usage

```ts
import { aiServiceRef } from '@backstage/ai-node';
import type { OpenHarnessOptions } from '@backstage/ai-node/alpha';

// inside a backend plugin's registerInit:
const ai = env.ai; // deps: { ai: aiServiceRef }
```

```ts
const { harness, context, release } = await ai.openHarness({
  sessionId,
  config: { root: config, path: 'catalogAssistant' },
  credentials, // original authenticated Backstage caller
  registry, // reproducible definitions built with injected services
  registryVersion: '2026-11-16.1',
});
try {
  const conversation = await harness.root(context);
  // native Pi operations: configure, submit, wait, forks, tasks, watches...
} finally {
  await release();
}
```

## Configuration

Each consuming plugin explicitly supplies a root config and its own path.
The initial schema at that path is:

```yaml
<plugin-chosen-path>:
  mode: service | interactive
  model:
    provider: <provider-id>
    modelId: <model-id>
  thinkingLevel: off | minimal | low | medium | high | xhigh | max
```

- `mode: service` requires `model.provider` and `model.modelId`.
- `mode: interactive` may omit the model until an explicit selection, but
  generation is never permitted without a model: the service injects no
  default, and a model-less conversation rejects generation natively.
- Configuration initializes **new conversations only** (including the root
  and raw `tx.createConversation`); persisted state and forks are never reset
  on reopen, and explicit native initialization wins per field.
- Errors name the consuming plugin, the exact config path, the offending
  field, and corrective guidance.

Provider credential configuration and key material are installation-scoped
and are validated separately (Wave 1).

## Semantics of the managed handle

- **Session ownership** is fixed when a session is created, atomically with
  its owner; opens by other principals are rejected.
- **Single-flight acquisition** per namespace: concurrent opens share one
  process-local harness; a changed registry version or incompatible config
  identity under a live handle is rejected, never silently replaced.
- **Reference counting**: release is idempotent per acquisition; the last
  release closes the shared harness. Methods on a released handle reject.
- **Fail-closed Wave 0**: without the Wave 1 integration (Knex Pi storage
  adapter, exclusive namespace lease, guarded model operation boundary),
  production opens reject with an actionable error. Scaffold tests use
  explicitly labeled non-production stand-ins, which are not security or
  durability.

## Migrations

The AI service shares the consuming plugin's database but keeps its
migrations in a separate ledger table, `ai_database_migrations`, and honors
`database.migrations.skip`. When skipping is enabled but the AI schema has
not been created, migration fails with an actionable error rather than
migrating implicitly. The shared `migrations` directory is discovered as a
whole, by name range, and filenames are never enumerated in code.

## Tests and the ESM-only Pi dependency stack

The Pi dependency stack (`@earendil-works/chord`, `-pi-ai`, `-pi-durable`)
is ESM-only with `import`-condition export maps, so this package ships a
scoped Jest resolver (`jestResolver.js`, referenced from the `jest` key of
`package.json`) that adds the `import` export condition for
`@earendil-works/*` specifiers only, leaving CommonJS dependencies
untouched. Run tests through the repository root, as usual:

```bash
CI=1 yarn test packages/ai-node
```
