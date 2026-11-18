# @backstage/ai-node-provider-azure

Azure OpenAI Responses provider module for the managed AI service.

This package provides provider module definitions for `@backstage/ai-node`. Provider
modules are plain data plus the pinned `pi-ai` adapter: they declare the certified
operations, the destination templates and the request envelope validation for one
provider family, and they are registered by the host (for example through the AI
backend plugin or a scaffolder action module) rather than loaded automatically.

```ts
import { azureProviderModules } from '@backstage/ai-node-provider-azure';

const providerModules = [...providerModules, ...azureProviderModules];
```
