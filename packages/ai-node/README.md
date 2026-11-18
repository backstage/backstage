# @backstage/ai-node

Managed, low-level AI service primitives for Backstage backend plugins, built
on the [Pi Durable](https://github.com/earendil-works/pi) execution engine.

> **Status: Wave 2 configuration.** The service surface here is alpha and
> coupled to the experimental `@earendil-works/pi-durable` engine (pinned to
> `1.5.2`). The managed primitive is wired for production: exclusive
> namespace leases with startup recovery, fenced database persistence,
> guarded model dispatch with per-attempt permission checks, a durable
> attempt journal, and an installation configuration source for provider
> credentials and the canonical model catalog. An installation that
> configures nothing keeps the fail-closed default: every dispatch is denied
> with an actionable reason and no model resolves.

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

The installation-scoped configuration described below is separate from this
per-plugin section: each consuming plugin still chooses its own path.

## Installation configuration

Provider credentials and the canonical model catalog are **installation**
scoped, not plugin scoped. The default `aiServiceRef` factory reads them at
the `ai` path (exported as `AI_INSTALLATION_CONFIG_PATH`); a host that wires
the integration itself can pass any path to `configureAiInstallation`. The
one exception is encrypted personal credentials: each plugin's service
instance keeps its own encrypted personal store, so a user's personal
credentials saved through one plugin are not shared with another plugin's
instance. Cross-plugin credential hosting is not available.

```yaml
ai:
  credentials:
    # Standard base64 of exactly 32 raw bytes, kept in an app-config secret.
    encryptionKey: ${AI_CREDENTIAL_ENCRYPTION_KEY}
    # `user-first` (default) or `org-first`.
    precedence: user-first
    scopes:
      org:
        anthropic:
          type: api_key
          key: ${ANTHROPIC_API_KEY}
      service:catalog-indexer:
        openai:
          type: oauth
          refresh: ...
          access: ...
          expires: 1234
    # Trusted OAuth token routes per provider for guarded auth operations.
    # Providers without an entry cannot refresh OAuth credentials; the
    # supported auth providers are Anthropic and OpenAI token endpoints.
    tokenEndpoints:
      anthropic: https://platform.claude.com/v1/oauth/token
  models:
    - provider: openai
      modelId: gpt-5
      # Adapter identifier of a provider module; the guard certifies it.
      api: openai-responses
      baseUrl: https://api.openai.com/v1
      contextWindow: 400000
      maxTokens: 128000
      name: GPT-5 # optional, defaults to modelId
      reasoning: true # optional, defaults to false
      input: [text, image] # optional, defaults to [text]
      cost: { input: 1.25, output: 10, cacheRead: 0.125 } # unset rates are 0
```

Both sections are optional. Without `ai.credentials` no credential stores are
wired, and without `ai.models` no model resolves: a missing entry is always a
journaled, actionable denial, never a fallback.

- **`encryptionKey`** is required whenever `ai.credentials` exists, because it
  encrypts personal credentials. Generate it with
  `openssl rand -base64 32`, supply it through an environment variable, and do
  not commit it. A non-canonical encoding or the wrong length rejects at
  startup with an error that never echoes the key material.
- **`scopes`** accepts exactly `org` and `service:<id>`. Personal credentials
  are never supplied through configuration — user scopes are rejected with
  guidance, because they live in the encrypted personal store written by the
  login flow. These installation stores are read-only: a `modify` callback
  that changes the value rejects, `delete` rejects, and a no-op `modify`
  resolves.
- **Credential entries are opaque.** The schema validates structure only;
  the credential kind (`api_key`, `oauth`, a future kind) and its fields are
  interpreted by the credential stores and provider modules that consume
  them, so configuration never encodes provider semantics.
- **`tokenEndpoints`** lists, per provider, the trusted OAuth token routes
  guarded auth operations may use for credential refresh — absolute
  `https` URLs on the provider's own origin ending in the reserved
  `/oauth/token` or `/v1/oauth/token` route. A provider without an entry
  cannot refresh OAuth credentials; the supported auth providers are
  Anthropic (`/v1/oauth/token`, matching its module's reserved route) and
  OpenAI token endpoints. Declaring an endpoint alone does not enable
  refresh: the guarded refresh machinery is internal to the package, and
  the wiring that would invoke it before dispatch is not exposed by the
  public or alpha API yet. In the shipped configuration an expired OAuth
  credential therefore fails closed with an actionable denial; publicly
  configurable pre-dispatch refresh is future work.
- **`precedence`** selects which credential scope wins when both a personal and
  an installation credential exist for a provider. The default `user-first`
  prefers the caller's own provider account; `org-first` pins the installation
  account. Absence always falls through to the next scope, while a failed read
  fails closed. Service principals only ever use installation credentials.
- **`models`** is the canonical catalog: the only models this installation may
  dispatch, keyed by `provider` and `modelId`. Fields are the actual provider
  and model identifiers plus the adapter and destination the guard verifies —
  there are no aliases, tiers, or effort abstractions. `contextWindow` and
  `maxTokens` are required because the engine derives sizing and compaction
  from them; the schema never invents them.
- **Permissions** are derived per configured model:
  `ai.model.<provider>.<modelId>.use` with each segment passed through
  `encodeURIComponent` and literal dots encoded as `%2E`. Names are exact;
  grant each pair (or each pair of a provider) in policy.
- **Fail-closed validation**: unknown fields, duplicate models, unusable
  adapter identifiers, non-http(s) destinations and malformed scope keys all
  reject with the exact configuration path, the offending field, and
  corrective guidance.

## Rotate the personal credential encryption key

Rotation changes key material, not the stored encryption format or `key_version`.
Existing credentials remain readable during the rotation window. Both keys must
be the standard base64 encoding of 32 bytes and supplied as secrets:

```yaml
ai:
  credentials:
    encryptionKey: ${AI_CREDENTIAL_NEW_KEY}
    rotation:
      previousEncryptionKey: ${AI_CREDENTIAL_OLD_KEY}
```

Before changing keys, stop all old-key writers and readers across every instance
that shares the plugin's credential database. Old instances cannot read rows
rewritten with the new key and may write new rows under the old key. Start all
instances with the new key and previous key together. During the window, a read
of an old-key credential re-encrypts it under the existing per-credential lock;
new writes always use the new key. Failed decryption or writes fail closed.

A trusted host that already holds a live namespace fence can proactively rotate
all personal credentials in its plugin database:

```ts
const installation = configureAiInstallation({ source, db });
const result = await installation.credentialRotation!.rotate(fence);
```

The host must own and renew `fence` throughout the operation. Each page and
write checks it; losing the fence stops the operation. The result contains only
`inspected` and `rotated` counts, not credential values. An interrupted run
may leave a mix of keys; repeat it with both keys configured. After all old-key
writers are stopped, rerun until `rotated` is zero for every plugin database,
then remove `rotation.previousEncryptionKey`. Keep a secure backup of the
previous key until all necessary backups have also been migrated or retired.

The stock `AiService` does not expose a maintenance fence. This batch operation
is available to integrations and maintenance tooling that already own one; a
public maintenance or admin fence surface is future work. It does not grant
access to other plugins' databases or return personal credentials.

## Semantics of the managed handle

- **Session ownership** is fixed when a session is created, atomically with
  its owner; opens by other principals are rejected.
- **Single-flight acquisition** per namespace: concurrent opens share one
  process-local harness; a changed registry version or incompatible config
  identity under a live handle is rejected, never silently replaced.
- **Reference counting**: release is idempotent per acquisition; the last
  release closes the shared harness. Methods on a released handle reject.
- **Production wiring**: the integration composes the exclusive namespace
  lease with keepalive and startup recovery (admission and revocation), the
  fenced Knex Pi storage adapter, guarded model operations with per-attempt
  permission, fence, and credential-generation checks, the scoped credential
  stores and canonical catalog from installation configuration, and the
  durable attempt journal. When a lease is invalidated, local handles of that
  namespace are drained. Installation configuration is optional; without it
  model dispatch is denied with an actionable reason and model lookups resolve
  no model. Scaffold tests use explicitly labeled non-production stand-ins,
  which are not security or durability.

## Migrations

The AI service shares the consuming plugin's database but keeps its
migrations in a separate ledger table, `ai_database_migrations`, and honors
`database.migrations.skip`. When skipping is enabled, every required
migration must already be recorded in the ledger: a missing ledger or
pending migrations fail with an actionable error rather than migrating
implicitly. The shared `migrations` directory is discovered as a whole, by
name range, ships in the published package, and filenames are never
enumerated in code.

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
