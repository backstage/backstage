# @backstage/ai-node-provider-openai

OpenAI provider modules for the [`@backstage/ai-node`](../ai-node) managed
AI service: the Responses, Chat Completions and Codex (SSE) chat modules and
the Decisions classify module.

## Installation

```bash
yarn add @backstage/ai-node-provider-openai
```

Register the modules with the AI service together with the other provider
module collections your installation composes:

```ts
import { openaiProviderModules } from '@backstage/ai-node-provider-openai';

const modules = createAiModuleRegistry({
  providerModules: [...openaiProviderModules, ...otherProviderModules],
  toolModules: [],
});
```
