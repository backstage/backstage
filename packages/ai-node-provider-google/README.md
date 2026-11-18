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
import { createAiModuleRegistry } from '@backstage/ai-node/alpha';
import { googleProviderModules } from '@backstage/ai-node-provider-google/alpha';

const modules = createAiModuleRegistry({
  providerModules: googleProviderModules,
  toolModules: [],
});
```
