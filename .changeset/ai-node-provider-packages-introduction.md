---
'@backstage/ai-node-provider-google': minor
'@backstage/ai-node-provider-openai': minor
'@backstage/ai-node-provider-anthropic': minor
'@backstage/ai-node-provider-azure': minor
'@backstage/ai-node-provider-typesafe': minor
'@backstage/ai-node-provider-openrouter': minor
---

Added six provider packages for the managed AI service — `@backstage/ai-node-provider-google`, `-openai`, `-anthropic`, `-azure`, `-typesafe`, and `-openrouter` — each carrying one provider family's dispatch modules, extracted from the `@backstage/ai-node` core so that the core registers provider modules without shipping any. Every package exports its family's module collection for registration through the stock service factory's `providerModules` option (or any host's own composition); registration decides availability, so a family that is not registered fails closed exactly like an unlisted model.

The families: Google covers Gemini and Vertex AI, dispatching through the guarded worker transport that confines credentials and network access to the worker and settles in-flight work on worker loss; OpenAI covers the Responses, Chat Completions, and Codex chat transports plus the Decisions classifier module and the OAuth auth module for its token endpoints; Anthropic covers the Messages transport plus its OAuth auth module; Azure covers the Azure OpenAI Responses transport; TypeSafe covers the System One classification module; OpenRouter covers the image generation module over its chat-completions transport. The auth modules are the guarded, journaled OAuth token-request implementations — wiring them into automatic pre-dispatch refresh remains host surface, as in the core package.

Each package builds on the `@backstage/ai-node` module-authoring entry point (`@backstage/ai-node/modules`), which exports the provider and auth module contracts, the shared request-envelope validator, and the OAuth token-request helpers. `@backstage/plugin-ai-backend` composes all six collections with the core's empty remainder, so the backend plugin registers every family out of the box.
