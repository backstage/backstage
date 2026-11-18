# @backstage/plugin-scaffolder-backend-module-ai

The AI module for [`@backstage/plugin-scaffolder-backend`](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend),
supplying template actions that run through the managed AI service of
[`@backstage/ai-node`](https://www.npmjs.com/package/@backstage/ai-node).

_This package is experimental._

## Actions

### `ai:generate`

Generates content — file seeds, READMEs, PR descriptions — from a prompt and
optional context. The output is returned as `content`, or written to a path
in the workspace when `outputPath` is given.

```yaml
steps:
  - id: generateReadme
    action: ai:generate
    name: Generate README
    input:
      prompt: Write a README.md for a new backend service
      context: Service name: orders-api, written in TypeScript
```

### `ai:transform`

Fills structured parameter values from the submitting user's natural-language
answers. The model must return a JSON object matching the supplied schema,
which the action returns as its `values` output for later template steps.

```yaml
steps:
  - id: fillValues
    action: ai:transform
    name: Fill values with AI
    input:
      prompt: The service is named after the orders domain, central cluster
      schema:
        type: object
        properties:
          serviceName:
            type: string
          cluster:
            type: string
```

## Security model

Every action runs under the submitting user's credentials:

- Each scaffolder task owns an AI session keyed by the task id; only the
  user who created it can open it.
- Before the session opens, the action authorizes the submitting user for
  the configured model through the fixed `ai.model.use` permission, with
  the model pair evaluated against the policy's `isModel`, `isProvider`
  and `isModelType` conditions; the managed service re-checks it on every
  dispatch.
- Every model dispatch is authorized, journaled, and fenced by the managed
  AI service. Denials surface the recorded reason — for example, missing
  installation credentials or a model that is not in the installation's
  `ai.models` catalog — instead of falling back to another model.

## Installation

Add the module to your scaffolder backend:

```bash
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-ai
```

and register it in `packages/backend/src/index.ts`:

```ts
backend.add(import('@backstage/plugin-scaffolder-backend-module-ai'));
```

## Configuration

The module uses a private AI service instance with its own provider registrations.
It shares the installation's `ai` configuration conventions, but not the AI
backend plugin's dynamic module registrations or personal credential store.
The installation-scoped `ai` section of `app-config.yaml` configures the
model catalog and credentials (see the `@backstage/ai-node` documentation).
The scaffolder plugin selects its own model at `scaffolder.ai`:

```yaml
ai:
  credentials:
    encryptionKey: ${AI_CREDENTIALS_ENCRYPTION_KEY}
    scopes:
      org:
        openai:
          type: api_key
          key: ${OPENAI_API_KEY}
  models:
    - provider: openai
      modelId: gpt-4o-mini
      api: openai-responses
      baseUrl: https://api.openai.com/v1
      contextWindow: 128000
      maxTokens: 16384

scaffolder:
  ai:
    mode: service
    model:
      provider: openai
      modelId: gpt-4o-mini
```
