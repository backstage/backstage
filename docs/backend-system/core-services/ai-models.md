---
id: ai-models
title: AI Models Service (alpha)
sidebar_label: AI Models Service (alpha)
description: Documentation for the AI Models service
---

The AI Models Service gives backend plugins one provider-agnostic way to use AI models. Operators configure _provider instances_ under the `ai` configuration key, and plugins call the service without depending on a vendor SDK. The default implementation uses the [AI SDK](https://ai-sdk.dev/) internally, but the service's request and response types belong to Backstage.

:::note
This service is currently in **alpha** and is imported from `@backstage/backend-plugin-api/alpha`. The API and the configuration shape may change in future releases.
:::

The service supports text generation, text streaming, structured output, and embeddings. Image, speech, transcription, and video generation aren't supported yet.

## Configuring providers

Each key under `ai.providers` is a provider instance. The `type` field selects the _provider family_, which is the API and authentication model used to reach the models. The built-in families are:

| Type                | Capabilities                    | Notes                                                                         |
| :------------------ | :------------------------------ | :---------------------------------------------------------------------------- |
| `openai`            | `text-generation`, `embeddings` |                                                                               |
| `anthropic`         | `text-generation`               |                                                                               |
| `google`            | `text-generation`, `embeddings` | Google Generative AI (Gemini API).                                            |
| `bedrock`           | `text-generation`, `embeddings` | Uses `region`. Without an `apiKey`, it uses the default AWS credential chain. |
| `openai-compatible` | `text-generation`, `embeddings` | Requires `baseURL`. Use it for providers that expose an OpenAI-style API.     |

```yaml title="app-config.yaml"
ai:
  defaultProvider: openai
  providers:
    openai:
      type: openai
      apiKey: ${OPENAI_API_KEY}
      defaultModels:
        text-generation: gpt-4.1
        embeddings: text-embedding-3-large
      modelAliases:
        text-generation:
          fast: gpt-4.1-mini
    claude:
      type: anthropic
      apiKey: ${ANTHROPIC_API_KEY}
      defaultModels:
        text-generation: claude-sonnet-4-5
    groq:
      type: openai-compatible
      baseURL: https://api.groq.com/openai/v1
      apiKey: ${GROQ_API_KEY}
      defaultModels:
        text-generation: llama-3.3-70b-versatile
```

Every provider instance also accepts `baseURL` for proxies or private endpoints, and `headers` for additional HTTP headers. When `apiKey` is omitted, the built-in families fall back to the provider's standard environment variable, such as `OPENAI_API_KEY`.

### Capabilities

A capability is only enabled on a provider instance when it has an entry in `defaultModels`. In the example above, only the `openai` instance can serve embeddings. Calls that need a capability that isn't enabled fail with an error.

`modelAliases` maps operator-defined names to concrete model IDs for each capability. Callers can then request `fast` instead of a specific model ID, and operators can change the model behind the alias without changing plugin code.

### Startup validation

The service validates its configuration when a plugin that depends on it starts, and fails with a descriptive error when:

- two provider families are registered with the same `type`.
- a provider instance uses an unknown `type`.
- `ai.defaultProvider` doesn't refer to a configured provider instance.
- `defaultModels` or `modelAliases` names an unknown capability, or a capability that the provider family doesn't support.
- `modelAliases` has entries for a capability that isn't enabled in `defaultModels`.

When there is no `ai` configuration at all, the service still starts, and each call fails with an error that says AI models aren't configured.

## Using the service

Since the AI Models Service is an alpha API, the service reference is imported from `@backstage/backend-plugin-api/alpha` instead of `coreServices`.

```ts
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { aiModelsServiceRef } from '@backstage/backend-plugin-api/alpha';

export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: { aiModels: aiModelsServiceRef },
      async init({ aiModels }) {
        const { text, usage } = await aiModels.generateText({
          system: 'You write short summaries.',
          prompt: 'Summarize the purpose of a software catalog.',
        });
      },
    });
  },
});
```

### Selecting a provider and model

Every request can name a `provider` instance and a `model`. The `model` can be a concrete model ID or an alias. The service resolves them as follows:

- With both `provider` and `model`, it uses that model on that provider instance.
- With only `provider`, it uses that provider instance's default model for the capability.
- With neither, it uses `ai.defaultProvider` and its default model.
- With only `model`, it resolves the model within `ai.defaultProvider`. To use a model on another provider instance, name that provider explicitly.

```ts
await aiModels.generateText({ model: 'fast', prompt: 'Hello' });
await aiModels.generateText({ provider: 'claude', prompt: 'Hello' });
```

Each response includes the `provider` and `model` that served the request.

### Streaming text

`streamText` returns the text as it arrives and a promise with the final metadata. The promise settles after the text stream has been consumed.

```ts
const result = aiModels.streamText({ prompt: 'Write a haiku about plugins.' });
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
const { finishReason, usage } = await result.response;
```

### Structured output

`generateObject` accepts either a [zod](https://zod.dev/) schema or a plain JSON Schema object. A zod schema gives you a typed result that the service validates. A JSON Schema object is forwarded to the model, but the result isn't validated by the service.

```ts
import { z } from 'zod';

const { object } = await aiModels.generateObject({
  prompt: 'Review this change: ...',
  schema: z.object({
    summary: z.string(),
    risks: z.array(z.string()),
  }),
});
```

### Embeddings

```ts
const { embeddings } = await aiModels.embed({
  values: ['first document', 'second document'],
});
```

### Advanced runtime integration

`resolveModel` returns an AI SDK model object for agent frameworks that already understand AI SDK models. The same selection rules and capability checks apply. Prefer the other methods for ordinary use, since they don't expose AI SDK types.

```ts
const model = await aiModels.resolveModel({ capability: 'text-generation' });
```

## Adding provider families

You can contribute more provider families through `aiProviderFactoriesServiceRef` from `@backstage/backend-defaults/alpha`. A provider factory has a `type` and creates an `AIProvider` for each provider instance of that type. The provider declares the capabilities it supports and returns functions that create AI SDK models from model IDs.

```ts
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { aiProviderFactoriesServiceRef } from '@backstage/backend-defaults/alpha';
import { createMistral } from '@ai-sdk/mistral';

backend.add(
  createServiceFactory({
    service: aiProviderFactoriesServiceRef,
    deps: {},
    async factory() {
      return {
        type: 'mistral',
        async create({ id, config }) {
          const mistral = createMistral({
            apiKey: config.getOptionalString('apiKey'),
          });
          return {
            metadata: { id, type: 'mistral' },
            supports: capability => capability === 'text-generation',
            getLanguageModelFactory: () => modelId =>
              mistral.languageModel(modelId),
            healthCheck: async () => ({ healthy: true }),
          };
        },
      };
    },
  }),
);
```

Provider instances can then use `type: mistral` in configuration. A contributed factory can't reuse the `type` of a built-in family.

## Using AI models from the frontend

To let frontend code use the models you have configured, without exposing provider API keys, install the [AI gateway backend plugin](https://github.com/backstage/backstage/tree/master/plugins/ai-gateway-backend). It exposes the service over HTTP for signed-in users. The [AI gateway React library](https://github.com/backstage/backstage/tree/master/plugins/ai-gateway-react) provides the matching frontend client.
