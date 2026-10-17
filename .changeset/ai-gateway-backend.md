---
'@backstage/plugin-ai-gateway-backend': patch
---

Added a new backend plugin that exposes the alpha AI models service over HTTP, with endpoints to generate text, generate structured objects, and stream text. Requests require a signed-in user with the `ai.gateway.invoke` permission, and input size can be limited with `aiGateway.maxInputCharacters`, `aiGateway.maxSchemaCharacters`, and `aiGateway.maxOutputTokens`.
