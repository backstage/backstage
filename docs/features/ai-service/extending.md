---
id: ai-service-extending
title: Extending the AI Service
sidebar_label: Extending
description: Write provider modules, wrap custom gateways, register tool servers including local tools, and add auth modules
---

This guide covers the extension surfaces of the AI service: provider
modules for new model APIs, gateway wrappers, tool servers, and OAuth auth
modules. All of them register through the `aiModulesExtensionPoint` of the
AI plugin (or through a custom service factory composition).

## Registering modules

Backend modules for the `ai` plugin register provider, tool, and auth
modules through `aiModulesExtensionPoint` from
`@backstage/plugin-ai-backend/alpha`:

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

New admissions use the latest registrations; a live session retains its
module snapshot until all its handles are released. The stock provider
families stay registered — the extension point is additive. Replacing the
AI service factory is the exceptional path for hosts that want full
control of the composition.

## Writing a provider module

A provider module declares its identity, the credential kinds it accepts,
the destination templates it may call, and how it validates response
envelopes. The certified routes are literal templates: the journal
refuses any dispatch destination that does not match one, so a module
cannot widen its own reach at runtime. The existing families —
`anthropicMessages`, `openaiResponses`, `openaiDecisions`,
`googleGenerativeAi`, `googleVertex`, `azureResponses`,
`openrouterImages`, `typesafeSystemOne` — are the reference
implementations; `@backstage/ai-node-test-utils` carries provider
fixtures and the certification harness for writing your own.

Each provider family ships its own package
(`@backstage/ai-node-provider-anthropic`, and so on), exporting both the
individual modules and a frozen collection for registration. Auth modules
move with their families: `anthropicAuthModule` and `openaiAuthModule`
are carried as the `authModule` field of their provider modules, so
registering the provider family registers the OAuth refresh surface too.

## Custom gateways

A gateway such as Cloudflare AI Gateway or a TypeSafe deployment is
expressed by wrapping a certified module with `wrapProviderModule` from
`@backstage/ai-node/modules`:

```ts
import { wrapProviderModule } from '@backstage/ai-node/modules';
import { anthropicMessages } from '@backstage/ai-node-provider-anthropic';

const gatewayModule = wrapProviderModule(anthropicMessages, {
  baseUrl: 'https://gateway.internal.example/v1/acc-1/gw-1/anthropic',
  credentialKinds: ['api_key'],
});
```

The wrapper composes the gateway's base URL onto the module's certified
routes at construction, so the journal's route certification is untouched
and remains the single authority — a wrongly composed destination fails
closed at dispatch. The wrapped module keeps its certified adapter and
envelope validation, gains the gateway's provider id for credential
lookup, and replaces the direct module for its adapter (registering both
trips the registry's duplicate rejection — one or the other, never both).
OAuth through a gateway is refused at construction; use an API key keyed
by the gateway's provider id.

A module without certified destinations — a local tool module — is
rejected at construction: there is no route to compose the gateway base
onto.

Gateway credentials and models are configured like any other provider,
keyed by the gateway's own provider id — see
[Configuration](./configuration.md#custom-gateways).

## Tool servers

Tools register as tool modules through the same extension point. The tool
seam carries two kinds of server:

- An _HTTP_ tool server mediates a guarded fetch with a scoped
  credential, a pinned destination, and a route template — an MCP tool
  server is this kind.
- A _local_ tool server declares `run(input)` instead. The guard's local
  branch performs the decision, fence check, and per-attempt permission
  recheck before the function runs, and journals the outcome — but there
  is no transport to account for and no envelope to validate, and the
  function runs with the backend process's own privileges. That narrowing
  is deliberate: the guard cannot see or constrain what a local function
  does, so local servers must be registered on purpose.

`@backstage/ai-node-shell` is the reference local module — an unsandboxed
`run` command tool:

```ts
import { createRawShellToolModule } from '@backstage/ai-node-shell/alpha';

const shell = createRawShellToolModule({
  shell: '/bin/bash',
  cwd: '/workspace',
  timeoutMs: 30_000,
  maxOutputBytes: 1_000_000,
});
```

Non-zero exits fail with the captured output; timeouts kill the process
and settle as cancelled; output is truncated at `maxOutputBytes`. Its
audit boundary is identity-only: the journal records that an authorized,
fenced tool call ran and how it settled, but never the command content —
free text cannot be proven secret-free. Hosts that need command-level
audit should build a scoped tool with structured arguments instead.
