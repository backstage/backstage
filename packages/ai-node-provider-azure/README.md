# @backstage/ai-node-provider-azure

Azure OpenAI Responses provider module for the managed AI service.

This package provides provider module definitions for `@backstage/ai-node`. Provider
modules are plain data plus the pinned `pi-ai` adapter: they declare the certified
operations, the destination templates and the request envelope validation for one
provider family, and they are registered by the host (for example through the AI
backend plugin or a scaffolder action module) rather than loaded automatically.

```ts
import { aiServiceRef, createAiServiceFactory } from '@backstage/ai-node/alpha';
import { azureProviderModules } from '@backstage/ai-node-provider-azure/alpha';

// Build the AI service factory override that registers the Azure OpenAI
// provider modules, in place of the default factory.
const aiFactory = createAiServiceFactory({
  // Compose EVERY family the installation needs: a factory override
  // is global for aiServiceRef and replaces the default registration,
  // so listing only one family makes the others unavailable.
  providerModules: [
    ...azureProviderModules,
    // ...otherProviderModules, // compose the other families here
  ],
});
const serviceFactory = aiFactory(aiServiceRef);
```
