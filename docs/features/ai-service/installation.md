---
id: ai-service-installation
title: Installing the AI Service
sidebar_label: Installation
description: Add the AI backend plugin, register providers, and configure models and credentials
---

This guide adds the AI backend plugin to a Backstage backend and brings it
to a state where plugins can open sessions and dispatch models.

## Prerequisites

- A Backstage backend following the [new backend system](../../backend-system/index.md). The events, signals, and notifications services, which the plugin consumes, are registered by default in a `backend-defaults` backend.
- A PostgreSQL database (the journal and credential stores use Knex migrations; SQLite is supported for tests).

## Install the plugin

```shell
yarn add --cwd packages/backend @backstage/plugin-ai-backend
```

```ts
backend.add(import('@backstage/plugin-ai-backend'));
```

The plugin pre-registers the six stock provider families
(`@backstage/ai-node-provider-google`, `-openai`, `-anthropic`, `-azure`,
`-typesafe`, and `-openrouter`). Registering the plugin is not enough to
dispatch anything: no model resolves until you configure `ai.models`, and
no credential is available until you configure `ai.credentials`.

## Configure models

The `ai.models` list is the canonical catalog: the only models this
installation may dispatch.

```yaml
ai:
  models:
    - provider: anthropic
      modelId: claude-sonnet-4-5
      api: anthropic-messages
      baseUrl: https://api.anthropic.com
      type: chat
      contextWindow: 200000
      maxTokens: 16000
```

Every entry names a `provider`, a `modelId`, the certified adapter
identifier (`api`) of a registered provider module, and a `baseUrl`.
See [Configuration](./configuration.md) for the full schema, including
`classifier` and `image` model types.

## Configure credentials

Installation-owned credentials live under `ai.credentials.scopes`, keyed by
scope (`org` or `service:<id>`) and then by provider. A personal,
encrypted credential store requires an encryption key:

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
```

The key is standard base64 of exactly 32 raw bytes. Supply it through an
environment variable, never committed to the file. Credential entries are
opaque to the configuration layer — each entry carries a `type` matching a
kind the provider module supports, and the remaining fields are
interpreted by the module that consumes them.

A configuration entry whose credential kind no registered module for that
provider supports is rejected at startup, naming the supported kinds.

## Optional: OAuth refresh

For providers with OAuth credentials (Anthropic and OpenAI), declare the
token endpoint and public client ID to enable automatic refresh before
dispatch:

```yaml
ai:
  credentials:
    tokenEndpoints:
      anthropic:
        url: https://api.anthropic.com/oauth/token
        clientId: my-public-client-id
```

Refresh activates when both the token endpoint and the provider's auth
module are registered; with either half missing, an expired credential
remains a fail-closed denial that names what is missing.

## Verify

Start the backend and check readiness:

```shell
curl -s http://localhost:7007/api/ai/health
```

`200` with `{"status":"ok"}` means the service is up; `503` with
`"degraded"` reports which observability signal crossed its threshold.

To use the service from a plugin, continue with
[Using the service](./using-the-service.md). To control which models,
tools, and features each plugin may use, set up the
[permissions](./permissions.md).
