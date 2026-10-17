---
'@backstage/backend-defaults': patch
---

Added a default implementation of the alpha AI models service, `aiModelsServiceFactory`, which is included in the default backend services. Provider instances are configured under `ai.providers`, with built-in support for the `openai`, `anthropic`, `google`, `bedrock`, and `openai-compatible` provider families. Additional provider families can be contributed through `aiProviderFactoriesServiceRef`, available from `@backstage/backend-defaults/alpha`. The service only enables a capability when a default model is configured for it, and reports misconfiguration with descriptive errors at startup.
