# @backstage/ai-node

Managed, low-level AI service primitives for Backstage backend plugins, built
on the [Pi Durable](https://github.com/earendil-works/pi) execution engine.

> **Status: alpha.** The service surface here is alpha and coupled to the
> experimental `@earendil-works/pi-durable` engine (pinned to `1.5.2`). The
> managed primitive is wired for production: exclusive
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

## Provider registration

The default service registers no providers. Register trusted provider modules
with `createAiServiceFactory({ providerModules })` at the backend level, or
use the AI backend plugin's `aiModulesExtensionPoint` for its default service.
A custom service factory uses only its own registrations. A live admission
retains its module snapshot until its last handle is released; a fresh admission
uses the registrations available when it opens.

Provider packages can run `registerProviderCertification` from
`@backstage/ai-node-test-utils` in their test suites; the certification and
guard-construction machinery is published on the module-authoring entry
point, `@backstage/ai-node/modules`.

## Provider packages

Every provider family ships as its own package, alongside the two
host-composition packages:

- `@backstage/ai-node-provider-google` — Gemini and Vertex AI, over the guarded worker transport
- `@backstage/ai-node-provider-openai` — Responses, Chat Completions, and Codex chat, plus the Decisions classifier and the OAuth auth module
- `@backstage/ai-node-provider-anthropic` — Messages chat plus its OAuth auth module
- `@backstage/ai-node-provider-azure` — Azure OpenAI Responses
- `@backstage/ai-node-provider-typesafe` — System One classification
- `@backstage/ai-node-provider-openrouter` — image generation
- `@backstage/ai-node-codemode` — the default code mode extension construction

The default factory this package provides registers none of them: compose
the families your installation needs into a factory override. The stock
`@backstage/plugin-ai-backend` plugin pre-registers all six provider
families in its composed default, so installations using that plugin need
no factory override for the stock providers.

### Credential kinds

Each provider module declares the credential kinds it consumes, and a module
that ships an OAuth auth module declares both. What a family accepts is
therefore a property of the family, not of the permission model:

| Package                                  | Modules                                                            | Credential kinds   |
| ---------------------------------------- | ------------------------------------------------------------------ | ------------------ |
| `@backstage/ai-node-provider-anthropic`  | `anthropic-messages`                                               | `api_key`, `oauth` |
| `@backstage/ai-node-provider-openai`     | `openai-responses`, `openai-completions`, `openai-codex-responses` | `api_key`, `oauth` |
| `@backstage/ai-node-provider-openai`     | `openai-decisions`                                                 | `api_key`          |
| `@backstage/ai-node-provider-azure`      | `azure-openai-responses`                                           | `api_key`          |
| `@backstage/ai-node-provider-google`     | `google-generative-ai`, `google-vertex`                            | `api_key`          |
| `@backstage/ai-node-provider-typesafe`   | `typesafe-system-one`                                              | `api_key`          |
| `@backstage/ai-node-provider-openrouter` | `openrouter-images`                                                | `api_key`          |
| MCP tool servers                         | one module per server                                              | `api_key`, `oauth` |

An installation OAuth entry for an API-key-only family rejects at startup,
naming the provider, the configured kind and the supported kinds; a personal
OAuth credential stored later for such a provider is refused at dispatch with
the same guidance. A provider that serves several modules accepts the union of
their kinds.

## Custom gateways

pi's catalog treats a gateway as a provider of its own: the entry keeps its
own provider id and base URL while reusing a certified adapter. That works
here unchanged, because every check keys on the pieces the catalog already
carries:

- **module resolution is by `api`**, not by provider id, so
  `api: anthropic-messages` under `provider: my-gateway` resolves the
  certified Anthropic module;
- **credentials are scoped by the entry's provider id**, so a gateway reads its
  own `my-gateway` credential from the same scopes every other provider uses;
- **the destination must still be a certified route** of the resolved module,
  and the gateway's base URL has to produce one.

A gateway that serves a certified API at a bare path works as-is:

```yaml
ai:
  credentials:
    encryptionKey: ${AI_CREDENTIAL_ENCRYPTION_KEY}
    scopes:
      org:
        # Keyed by the gateway's own provider id.
        my-gateway:
          type: api_key
          key: ${MY_GATEWAY_API_KEY}
  models:
    - provider: my-gateway
      modelId: claude-sonnet-4-5
      # The certified adapter, not the gateway's name.
      api: anthropic-messages
      # Destination is '<baseUrl>/v1/messages', the certified route.
      baseUrl: https://gateway.internal.example
      contextWindow: 200000
      maxTokens: 64000
```

Gateway base URLs that re-root the API under their own path do **not**
match the certified routes as-is — both path-prefixed entries in pi's
catalog are in that position:

| Gateway entry (pi catalog)                                                                                               | Certified destination path                      | Module templates                     | Bare result          |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------ | -------------------- |
| `vercel-ai-gateway`, `anthropic-messages`, base `https://ai-gateway.vercel.sh`                                           | `/v1/messages`                                  | `/v1/messages`                       | dispatches           |
| `cloudflare-ai-gateway`, `anthropic-messages`, base `https://gateway.ai.cloudflare.com/v1/{ACCOUNT}/{GATEWAY}/anthropic` | `/v1/{ACCOUNT}/{GATEWAY}/anthropic/v1/messages` | `/v1/messages`                       | denied, nothing sent |
| `vercel-ai-gateway`, `typesafe-system-one`, base `https://ai-gateway.vercel.sh/typesafe/v1`                              | `/typesafe/v1/systemone`                        | `/v1/systemone`, `/api/v1/systemone` | denied, nothing sent |

For those, wrap the certified module with `wrapProviderModule` from
`@backstage/ai-node/modules`. The wrapper takes a certified module and the
gateway's base URL and, at construction, composes the gateway's path prefix
onto the module's certified route templates — the journal's route-template
check is unchanged and now certifies `gateway base + route`. The wrapped
module's adapter, envelope validation and certification carry over; the
wrapper contributes only the base and the credential interpretation, which
defaults to `api_key` keyed by the gateway's own provider id. A module
without certified destinations (a local tool module) is rejected at
construction — there is no route to compose the gateway base onto. A
wrapped module replaces the direct module for its `api` in the registry it
is registered into — both declare the same module id, so register one or
the other, never both:

```ts
import { wrapProviderModule } from '@backstage/ai-node/modules';
import { anthropicMessages } from '@backstage/ai-node-provider-anthropic/alpha';
import { createAiServiceFactory } from '@backstage/ai-node/alpha';

const anthropicThroughCloudflare = wrapProviderModule(anthropicMessages, {
  // The gateway re-roots the API under its own path.
  baseUrl:
    'https://gateway.ai.cloudflare.com/v1/my-account/my-gateway/anthropic',
});

// Registered instead of the direct anthropicMessages module:
const ai = createAiServiceFactory({
  providerModules: [anthropicThroughCloudflare /* ...otherProviderModules */],
});
```

With that registration, the `cloudflare-ai-gateway` catalog entry above
dispatches: its destination `/v1/my-account/my-gateway/anthropic/v1/messages`
now matches the composed template. The same wrapper handles the
path-prefixed TypeSafe entry (`baseUrl:
'https://ai-gateway.vercel.sh/typesafe/v1'` over the `typesafe-system-one`
module). The composition aligns itself to the route the module actually
appends — a family whose certified template carries the provider's own base
path (the TypeSafe `/v1`) composes differently from one whose template is the
bare route (the Anthropic `/v1/messages`) — and a template that cannot be
aligned falls back to the plain prefix join, which fails closed at dispatch
if it does not match. OAuth through a gateway is out of scope: the wrapper
refuses an `oauth` credential kind with guidance, so store an API key for
the gateway instead.

## Usage

```ts
import { aiServiceRef } from '@backstage/ai-node/alpha';
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
    # Per provider: the trusted refresh endpoint and the family's PUBLIC
    # OAuth client ID. Declaring both is what enables pre-dispatch refresh.
    tokenEndpoints:
      anthropic:
        url: https://platform.claude.com/v1/oauth/token
        clientId: ${ANTHROPIC_OAUTH_CLIENT_ID}
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
actionable denial recorded in the journal, never a fallback.

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
- **Credential kinds are checked against the modules.** The schema validates
  the entry's structure; the kind is then checked at startup against the
  modules registered for that provider's catalog entries, so a kind no module
  consumes rejects before the service starts rather than at dispatch. A
  provider with no registered module cannot be checked that way and stays
  dispatch-time fail-closed. See [Credential kinds](#credential-kinds) for the
  per-family table; a credential stored later in a personal store is checked
  at dispatch instead, with the same guidance.
- **`tokenEndpoints`** enables pre-dispatch OAuth refresh. Each entry holds
  the provider's `url` — an absolute `https` URL on its own origin ending in
  the reserved `/oauth/token` or `/v1/oauth/token` route, without query,
  fragment or `userinfo` — and its `clientId`, the family's public OAuth client
  ID (public by contract, never a secret, which is why it lives in
  configuration). When an entry names a provider whose registered family
  ships an auth module, the service wires the guarded refresh itself:
  a dispatch whose OAuth credential is at or inside the refresh window
  performs one `auth.token` operation recorded in the journal, writes the rotated
  credential to the store it came from, re-reads the authority and only then
  sends. Both halves are required — an endpoint with no family auth module,
  or a family with no endpoint, keeps the fail-closed behavior and an expired
  credential is denied with an actionable reason naming what is missing.
  Anthropic (`/v1/oauth/token`) and OpenAI (`/oauth/token`) are the supported
  token routes.
- **Refresh contract, including its crash window.** A failed refresh fails
  closed: the provider's rejection, an unusable token body or a read-only
  store denies the dispatch and journals the denial, and nothing is sent
  with the stale credential. The remote exchange and the local write are two
  steps, so a process death after the provider rotated the token but before
  the write commits leaves the store holding a refresh token the provider has
  already invalidated: that is an uncertain rotation, the caller must
  re-authenticate or run the store's recovery path, and this package makes no
  exactly-once claim across a crash. Installation-scoped (org and service)
  credentials are read-only by design and are never refreshed; refresh
  applies to personal credentials.
- **Custom refresh.** The default factory auto-wires refresh from the
  configuration above. Reach for the alpha hook when a family's auth module
  is not part of a registered provider module, or when the refresh machinery
  must be replaced: pass `refreshExpiredCredential` to
  `createAiServiceFactory` (or `createPrivateAiService`), and build it with
  `createCredentialRefreshHook` from `@backstage/ai-node/alpha` to keep the
  guarded, journal-recorded behavior while supplying your own modules or transport.
  An explicit hook always wins over the config-driven default.
- **`precedence`** selects which credential scope wins when both a personal and
  an installation credential exist for a provider. The default `user-first`
  prefers the caller's own provider account; `org-first` pins the installation
  account. Absence always falls through to the next scope, while a failed read
  fails closed. Service principals only ever use installation credentials.
- **`models`** is the canonical catalog: the only models this installation may
  dispatch, keyed by `provider` and `modelId`. Fields are the actual provider
  and model identifiers plus the adapter and destination the guard verifies —
  there are no aliases, tiers, or effort abstractions. Each entry's `type`
  follows the pinned pi-ai catalog shapes: `chat` (the default) for
  generation, `classifier` for classification, `image` for image generation.
  `contextWindow` is required for `chat` and `classifier` entries (the engine
  derives sizing and compaction from it; the schema never invents it) and must
  be absent for `image` entries, which carry none; `maxTokens` is required for
  `chat` and optional for the others.
- **Permissions** are one fixed permission per resource kind:
  `ai.model.use` for every dispatch, with the model pair travelling as
  the resource the service already holds. Granularity lives in the
  policy's rules, not in permission names — see [Model and tool
  permissions](#model-and-tool-permissions).
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

## Model, tool and feature permissions

Every dispatch is checked against one fixed permission, so policy authors
write rules rather than per-model names. `@backstage/plugin-ai-common`
carries the names and resource types; `@backstage/ai-node/alpha` carries
the rules and the helpers that produce conditional decisions.

| Permission       | Resource type | Rules                                       |
| ---------------- | ------------- | ------------------------------------------- |
| `ai.model.use`   | `ai-model`    | `isModel`, `isProvider`, `isModelType`      |
| `ai.tool.use`    | `ai-tool`     | `isTool`, `isServer`, `isPlugin`            |
| `ai.feature.use` | `ai-feature`  | `isFeature`, `isPlugin` (`isFeaturePlugin`) |

The service asks the permission backend for a conditional decision with
the caller's own credentials on every attempt — the guard's recheck for
model dispatch, the guarded tool operations before a tool call is
recorded or sent, and the feature check when a harness opens. The
policy's conditions are then evaluated in process against the attributes
the service already holds: `{ provider, modelId, type? }` for a model,
`{ serverId, toolName, pluginId }` for a tool, and `{ pluginId, feature }`
for a feature. Anything that is not a positive evaluation — `DENY`, no
decision, a condition naming an unknown rule, a rule of another resource
type, or parameters the rule rejects — denies, and a denial during dispatch
is recorded in the journal like any other. A tool's `pluginId` is the plugin whose
harness dispatched it, taken from the session namespace, never from the
call's payload, so `isPlugin` scopes tools per plugin: a scaffolder
harness never reaching a shell tool is one rule.

> **A blanket `ALLOW` grants everything.** Because there is one permission
> per resource kind, a policy that returns `ALLOW` for `ai.model.use`
> without conditions grants every cataloged model, and an unconditional
> `ALLOW` for `ai.tool.use` grants every registered tool. The default
> posture is deny: return nothing (or a `DENY`) and nothing dispatches.

A policy grants by returning the conditions the service evaluates:

```ts
import {
  isPermission,
  type PolicyDecision,
} from '@backstage/plugin-permission-common';
import type {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import {
  aiFeatureConditions,
  aiModelConditions,
  aiToolConditions,
  createAiFeatureConditionalDecision,
  createAiModelConditionalDecision,
  createAiToolConditionalDecision,
} from '@backstage/ai-node/alpha';
import {
  aiFeatureUsePermission,
  aiModelUsePermission,
  aiToolUsePermission,
} from '@backstage/plugin-ai-common';

export class AiPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, aiModelUsePermission)) {
      return createAiModelConditionalDecision(request.permission, {
        anyOf: [
          aiModelConditions.isModel({ provider: 'openai', modelId: 'gpt-5' }),
          aiModelConditions.isProvider({ provider: 'anthropic' }),
          aiModelConditions.isModelType({ type: 'image' }),
        ],
      });
    }
    if (isPermission(request.permission, aiToolUsePermission)) {
      return createAiToolConditionalDecision(request.permission, {
        allOf: [
          aiToolConditions.isServer({ serverId: 'files' }),
          aiToolConditions.isPlugin({ pluginId: 'scaffolder' }),
        ],
      });
    }
    if (isPermission(request.permission, aiFeatureUsePermission)) {
      return createAiFeatureConditionalDecision(
        request.permission,
        aiFeatureConditions.isPlugin({ pluginId: 'scaffolder' }),
      );
    }
    if (user === undefined) {
      return { result: 'DENY' };
    }
    return { result: 'ALLOW' };
  }
}
```

The conditional-decision helper takes the permission and the criteria
directly; conditions come from the matching conditions object
(`aiModelConditions`, `aiToolConditions`, `aiFeatureConditions`) and compose
with `anyOf`, `allOf` and `not`. The caller's identity is the optional second `user` argument of
`handle`, never part of the query.

Discovery
(`listModels`, `listProviders`) applies the same evaluated conditions per
pair, so it reports exactly the pairs the caller's own credentials are
allowed to use, each with its catalog fields (adapter, type, context
window, output limit). A model outside the canonical `ai.models` catalog
never resolves and no policy can dispatch it.

## Local tool servers

The tool seam carries two kinds of server. An HTTP server mediates a guarded
fetch with a scoped credential, a pinned destination and a route template —
an MCP tool server is this kind. A **local** server
declares `run(input)` instead, and the guard's local branch dispatches it: the
decision, the fence check and the per-attempt `ai.tool.use` recheck happen
before the function runs, and the outcome is recorded, but there is no send
to account for and no envelope to validate — the function runs with the
backend process's own privileges.

That narrowing is deliberate and it is the reason a local server has to be
registered on purpose: the guard cannot see or constrain what such a function
does. `@backstage/ai-node-shell` is the reference example (an unsandboxed
`run` command tool, with its audit-boundary trade-off documented in that
package's README); the shipped tool servers stay HTTP-mediated.

Local dispatches are recorded in the journal by identity: the tool identity, session,
principal, decision and outcome are recorded, and the journal row has no
destination because nothing was sent. Command arguments never reach the
journal, exactly like prompts and payloads.

## Harness features

A harness exposes features, and a plugin declares the ones it needs when it
opens the harness:

| Feature    | What it exposes                                   |
| ---------- | ------------------------------------------------- |
| `tools`    | the guarded tool operations on the managed handle |
| `codemode` | the code-mode sandbox and its `models.*` globals  |

A feature is available when three things hold: the service registers it
(no registered tool server means the `tools` feature does not exist, no
configured code-mode extension means `codemode` does not), the plugin
requests it for that harness, and `ai.feature.use` allows it for that
plugin and feature. A denied feature rejects the open with a reason naming
the feature and the plugin; a feature the service does not register rejects
with a registration reason, because that is wiring and not policy.

Availability is captured at admission, exactly like module
registrations: a live harness keeps its features until its last handle
releases, a fresh open evaluates again, and re-opening a live session with a
different declaration is rejected rather than silently changing the surface
under running work. A plugin that requests nothing gets a harness with no
feature surface at all — no tool operations, no code-mode globals.

```ts
const handle = await ai.openHarness({
  sessionId: 'triage',
  config: { root: config, path: 'triage' },
  credentials,
  registry,
  registryVersion: 'v1',
  features: ['tools'],
});
```

> **No policy means the feature is available.** The permission framework's
> default is allow, so a registered feature reaches every plugin that
> requests it until a policy denies it. That is the same sharp edge as the
> blanket `ALLOW` on model and tool use, stated plainly: restricting
> features is something a deployment must do deliberately, by denying
> `ai.feature.use` with `not(isFeature({ feature: 'codemode' }))` or by
> naming the plugins that may have it with
> `isPlugin({ pluginId: 'scaffolder' })`.

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

Contributor note: the Pi dependency stack (`@earendil-works/chord`,
`-pi-ai`, `-pi-durable`) is ESM-only with `import`-condition export maps,
so the `@backstage/ai-node` package family shares one Jest resolver
(`packages/ai-node/jestResolver.js`, referenced from the `jest` key of
every family package's `package.json`) that adds the `import` export
condition for `@earendil-works/*` specifiers only, leaving CommonJS
dependencies untouched. Run tests through the repository root, as usual:

```bash
CI=1 yarn test packages/ai-node
```
