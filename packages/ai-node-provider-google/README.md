# @backstage/ai-node-provider-google

Google provider modules (Gemini and Vertex AI) for the
[`@backstage/ai-node`](../ai-node) managed AI service.

Both modules dispatch through an isolated worker runtime whose global fetch is
shimmed for the worker's lifetime, because the pinned Google SDK has no
request-scoped transport hook. Authority is bound per async stream through the
job's own message port, never worker-global; see the module TSDoc for the
trust boundary.

## Installation

```bash
yarn add @backstage/ai-node-provider-google
```

Register the modules with the AI service together with the other provider
module collections your installation composes:

```ts
import { aiServiceRef, createAiServiceFactory } from '@backstage/ai-node/alpha';
import { googleProviderModules } from '@backstage/ai-node-provider-google/alpha';

// Build the AI service factory override that registers the Google
// provider modules, in place of the default factory.
const aiFactory = createAiServiceFactory({
  // Compose EVERY family the installation needs: a factory override
  // is global for aiServiceRef and replaces the default registration,
  // so listing only one family makes the others unavailable.
  providerModules: [
    ...googleProviderModules,
    // ...otherProviderModules, // compose the other families here
  ],
});
const serviceFactory = aiFactory(aiServiceRef);
```

Add `serviceFactory` to your backend (`backend.add(serviceFactory)`,
where `backend` is your `Backend` instance from
`@backstage/backend-defaults`); every opened harness can then use the
Google models.

Two consequences of the factory override, stated plainly: it is
global for `aiServiceRef` (every consumer of the service sees the
same modules), and it bypasses the dynamic module registrations made
through the AI backend plugin's extension points — the array you pass
is the complete registration. Note that the stock `ai` backend
plugin already registers these modules in its composed default, so
re-registering the same family through its `aiModulesExtensionPoint`
would be rejected as a duplicate module id — the extension point is
for additional, distinct modules.
