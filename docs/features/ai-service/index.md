---
id: ai-service-index
title: Backstage AI Service
sidebar_label: Overview
description: A managed, permission-gated AI service that lets backstage plugins dispatch model calls through certified providers with an append-only decision journal
---

The Backstage AI service gives plugins a managed path for AI model calls.
Instead of each plugin holding provider API keys and making its own HTTP
calls, plugins open a _harness_ against the service, and every model or
tool dispatch runs through a guarded path that checks permissions with the
caller's own credentials, resolves credentials from the installation's
stores, and records its decision in an append-only journal before the
request leaves the process.

:::note Reference implementation

The AI service ships as a working reference implementation across a family
of packages with a full test matrix, crash-recovery verification, and API
reports. It is not part of the Backstage core distribution; install the
packages you need, as described in [Installation](./installation.md).

:::

## What the service does

- **Managed model dispatch.** Plugins call models through a single guarded
  facade. The guard denies before execution — a model or tool call that is
  not allowed never reaches the provider.
- **Backstage permissions, not configuration.** Which models, tools, and
  features a plugin may use is expressed in the Backstage
  [permission framework](./permissions.md) with resource rules such as
  `isModel` and `isFeature`, not in an allowlist in `app-config.yaml`.
- **Certified providers only.** Every provider module declares the routes
  it may call and how it validates responses; the journal refuses any
  destination that does not match a certified route.
- **An append-only decision journal.** Every allow and deny is written
  before dispatch, with outcomes and crash recovery, and deliberately
  without any record of prompts or completions. See
  [The audit journal](./audit-journal.md).
- **Credentials with kinds.** The installation holds API keys and OAuth
  credentials in scoped stores; OAuth refresh is wired per provider.
  Custom gateways are supported by wrapping certified modules.
- **Live observation.** Session events stream to the submitter over SSE
  and to the session owner's other connections through the signals
  service.

## Package map

| Package                                          | Role                                                                                  |
| :----------------------------------------------- | :------------------------------------------------------------------------------------ |
| `@backstage/plugin-ai-backend`                   | The backend plugin: routes under `/api/ai/v1`, health, signals, notifications         |
| `@backstage/plugin-ai-common`                    | Permissions and resource types shared by frontend and backend                         |
| `@backstage/ai-node`                             | The service core: guard, journal, credentials, permissions rules, integration         |
| `@backstage/ai-node-provider-*`                  | Provider families: `anthropic`, `openai`, `azure`, `google`, `typesafe`, `openrouter` |
| `@backstage/ai-node-shell`                       | A raw shell tool module for the local tool kind                                       |
| `@backstage/ai-node-codemode`                    | The sandboxed code-mode extension                                                     |
| `@backstage/ai-node-test-utils`                  | Test harnesses and provider fixtures for adopters writing their own modules           |
| `@backstage/plugin-scaffolder-backend-module-ai` | Scaffolder actions `ai:generate` and `ai:transform`                                   |

Everything is opt-in: the plugin registers no providers you have not
configured, a plugin that requests no features gets no tool surface and no
code-mode sandbox, and a harness that requests nothing dispatches nothing.

## Where to go next

- [Installation](./installation.md) — add the plugin, configure models and
  credentials.
- [Configuration](./configuration.md) — the full `ai` configuration
  surface.
- [Permissions](./permissions.md) — the five permissions and their
  resource rules.
- [Using the service](./using-the-service.md) — opening a harness from a
  backend plugin, streaming, signals.
- [Extending](./extending.md) — writing provider modules, wrapping
  gateways, local tool modules.
- [The audit journal](./audit-journal.md) — what is recorded, and what
  deliberately is not.
