---
id: ai-service-configuration
title: AI Service Configuration
sidebar_label: Configuration
description: The full ai configuration surface for the Backstage AI service
---

The AI service reads installation-scoped configuration at the `ai` path.
Both sections are optional and fail closed: without `ai.credentials` no
credential stores are wired, and without `ai.models` no model resolves — a
missing entry is an actionable denial recorded in the journal, never a fallback.

A host that wires the service integration itself can pass any other
configuration path to `configureAiInstallation`; the `ai` path is what the
default `aiServiceRef` factory reads.

## `ai.credentials`

| Key                              | Type                        | Default      | Description                                                                                                                                                                                           |
| :------------------------------- | :-------------------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `encryptionKey`                  | `string` (secret)           | –            | Standard base64 of exactly 32 raw bytes; the authenticated-encryption key for the encrypted personal credential store. Required when `ai.credentials` is present.                                     |
| `rotation.previousEncryptionKey` | `string` (secret)           | –            | The previous 32-byte key during personal credential encryption-key rotation.                                                                                                                          |
| `precedence`                     | `user-first` \| `org-first` | `user-first` | Which credential scope wins when both a personal and an installation credential exist for a provider.                                                                                                 |
| `scopes`                         | map                         | –            | Installation-owned credentials by scope. Scope keys are exactly `org` or `service:<id>`; user scopes are rejected because personal credentials live in the encrypted store written by the login flow. |
| `tokenEndpoints`                 | map                         | –            | Trusted OAuth token routes per provider, `{ url, clientId }`. Providers without an entry cannot refresh OAuth credentials.                                                                            |

Credential entries under `scopes.<scopeId>.<providerId>` are opaque to the
configuration layer: each carries a `type` matching a credential kind the
provider module supports (`api_key`, `oauth`), and the remaining fields
are credential material interpreted by the consuming module. Values are
secrets.

```yaml
ai:
  credentials:
    encryptionKey:
      $env: AI_CREDENTIAL_ENCRYPTION_KEY
    scopes:
      org:
        anthropic:
          type: api_key
          key: ${ANTHROPIC_API_KEY}
      service:catalog-indexer:
        openai:
          type: oauth
          access: ...
          refresh: ...
          expires: 1234
    tokenEndpoints:
      anthropic:
        url: https://api.anthropic.com/oauth/token
        clientId: my-public-client-id
```

A configuration entry whose credential type no registered module for that
provider supports is rejected at startup, naming the supported kinds — the
mismatch never surfaces as a dispatch-time denial. An entry for an
unregistered provider passes configuration and fails closed at dispatch.

Token endpoint URLs must be absolute `https` URLs on the provider's
origin ending in the reserved `/oauth/token` or `/v1/oauth/token` route.
The `clientId` is public by contract. The currently supported auth
providers are Anthropic and OpenAI token endpoints.

## `ai.models`

The canonical model catalog: the only models this installation may
dispatch. Duplicate `(provider, modelId)` pairs are rejected, and every
entry's `api` must be the certified adapter identifier of a registered
provider module.

| Key             | Type                              | Default   | Description                                                                                                            |
| :-------------- | :-------------------------------- | :-------- | :--------------------------------------------------------------------------------------------------------------------- |
| `provider`      | `string`                          | –         | Provider id; credentials resolve by this id.                                                                           |
| `modelId`       | `string`                          | –         | Model identifier.                                                                                                      |
| `api`           | `string`                          | –         | Certified adapter identifier of a registered provider module.                                                          |
| `baseUrl`       | `string`                          | –         | Base URL the certified routes are composed onto.                                                                       |
| `type`          | `chat` \| `classifier` \| `image` | `chat`    | Model type. `chat` dispatches generation, `classifier` classification, `image` image generation.                       |
| `contextWindow` | `number`                          | –         | Context window in tokens. Required for `chat` and `classifier`; an `image` entry carries none and must omit the field. |
| `maxTokens`     | `number`                          | –         | Output limit in tokens. Required for `chat` entries, optional for the others.                                          |
| `name`          | `string`                          | `modelId` | Display name.                                                                                                          |
| `reasoning`     | `boolean`                         | –         | Whether the model exposes reasoning control.                                                                           |
| `input`         | `string[]`                        | –         | Supported input modalities.                                                                                            |
| `cost`          | map                               | –         | Token rates: `input`, `output`, `cacheRead`, `cacheWrite`; unset rates are 0.                                          |

The engine derives sizing and compaction from `contextWindow` and
`maxTokens` and never invents a value.

## Custom gateways

A gateway such as Cloudflare AI Gateway or a TypeSafe deployment is
expressed as its own provider: its entries in `ai.models` carry the
gateway's provider id, the certified adapter of the wrapped family, and
the gateway's `baseUrl`; its credentials live under the same
`ai.credentials.scopes` keyed by the gateway's provider id. The module is
wrapped with `wrapProviderModule` at registration — see
[Extending](./extending.md#custom-gateways).

## Per-plugin configuration

Each consuming plugin chooses its own agent configuration path and passes
the root configuration plus that path to `openHarness` — there is no
required `ai.plugins.*` or `<pluginId>.ai` namespace. The schema at a
plugin-selected path is:

```yaml
<plugin-chosen-path>:
  mode: service | interactive
  model:
    provider: <provider-id>
    modelId: <model-id>
  thinkingLevel: off | minimal | low | medium | high | xhigh | max
```

`mode: service` requires `model.provider` and `model.modelId`. The
scaffolder module, for example, reads `scaffolder.ai`.
