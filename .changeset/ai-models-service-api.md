---
'@backstage/backend-plugin-api': minor
---

Added an alpha AI models service, available as `aiModelsServiceRef` from `@backstage/backend-plugin-api/alpha`. It gives backend plugins provider-agnostic text generation, text streaming, structured output, and embeddings, using the AI providers configured under `ai.providers`. See the [AI Models Service documentation](https://backstage.io/docs/backend-system/core-services/ai-models) for details.
