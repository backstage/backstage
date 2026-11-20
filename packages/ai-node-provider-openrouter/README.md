# @backstage/ai-node-provider-openrouter

OpenRouter image generation module for the managed AI service.

This package provides provider module definitions for `@backstage/ai-node`. Provider
modules are plain data plus the pinned `pi-ai` adapter: they declare the certified
operations, the destination templates and the request envelope validation for one
provider family, and they are registered by the host (for example through the AI
backend plugin or a scaffolder action module) rather than loaded automatically.

```ts
import { aiServiceRef, createAiServiceFactory } from '@backstage/ai-node/alpha';
import { openrouterProviderModules } from '@backstage/ai-node-provider-openrouter/alpha';

// Build the AI service factory override that registers the OpenRouter
// provider modules, in place of the default factory.
const aiFactory = createAiServiceFactory({
  // Compose EVERY family the installation needs: a factory override
  // is global for aiServiceRef and replaces the default registration,
  // so listing only one family makes the others unavailable.
  providerModules: [
    ...openrouterProviderModules,
    // ...otherProviderModules, // compose the other families here
  ],
});
const serviceFactory = aiFactory(aiServiceRef);
```

Add `serviceFactory` to your backend (`backend.add(serviceFactory)`,
where `backend` is your `Backend` instance from
`@backstage/backend-defaults`); every opened harness can then use
the OpenRouter image models.

Two consequences of the factory override, stated plainly: it is
global for `aiServiceRef` (every consumer of the service sees the
same modules), and it bypasses the dynamic module registrations made
through the AI backend plugin's extension points — the array you pass
is the complete registration. Note that the stock `ai` backend
plugin already registers these modules in its composed default, so
re-registering the same family through its `aiModulesExtensionPoint`
would be rejected as a duplicate module id — the extension point is
for additional, distinct modules.
