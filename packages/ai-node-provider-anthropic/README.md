# @backstage/ai-node-provider-anthropic

Anthropic Claude chat and OAuth modules for the managed AI service.

This package provides provider module definitions for `@backstage/ai-node`. Provider
modules are plain data plus the pinned `pi-ai` adapter: they declare the certified
operations, the destination templates and the request envelope validation for one
provider family, and they are registered by the host (for example through the AI
backend plugin or a scaffolder action module) rather than loaded automatically.

```ts
import { aiServiceRef, createAiServiceFactory } from '@backstage/ai-node/alpha';
import { anthropicProviderModules } from '@backstage/ai-node-provider-anthropic/alpha';

// Build the AI service factory override that registers the Anthropic
// provider modules, in place of the default factory.
const aiFactory = createAiServiceFactory({
  // Compose EVERY family the installation needs: a factory override
  // is global for aiServiceRef and replaces the default registration,
  // so listing only one family makes the others unavailable.
  providerModules: [
    ...anthropicProviderModules,
    // ...otherProviderModules, // compose the other families here
  ],
});
const serviceFactory = aiFactory(aiServiceRef);
```
