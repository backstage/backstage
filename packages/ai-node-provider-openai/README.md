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
import { aiServiceRef, createAiServiceFactory } from '@backstage/ai-node/alpha';
import { openaiProviderModules } from '@backstage/ai-node-provider-openai/alpha';

// Build the AI service factory override that registers the OpenAI
// provider modules, in place of the default factory.
const aiFactory = createAiServiceFactory({
  // Compose EVERY family the installation needs: a factory override
  // is global for aiServiceRef and replaces the default registration,
  // so listing only one family makes the others unavailable.
  providerModules: [
    ...openaiProviderModules,
    // ...otherProviderModules, // compose the other families here
  ],
});
const serviceFactory = aiFactory(aiServiceRef);
```

Add `serviceFactory` to your backend (`backend.add(serviceFactory)`,
where `backend` is your `Backend` instance from
`@backstage/backend-defaults`); every opened harness can then use the
OpenAI models.

Two consequences of the factory override, stated plainly: it is
global for `aiServiceRef` (every consumer of the service sees the
same modules), and it bypasses the dynamic module registrations made
through the AI backend plugin's extension points — the array you pass
is the complete registration. Note that the stock `ai` backend
plugin already registers these modules in its composed default, so
re-registering the same family through its `aiModulesExtensionPoint`
would be rejected as a duplicate module id — the extension point is
for additional, distinct modules.
