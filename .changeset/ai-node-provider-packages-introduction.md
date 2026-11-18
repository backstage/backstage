---
'@backstage/ai-node-provider-google': minor
'@backstage/ai-node-provider-openai': minor
'@backstage/ai-node-provider-anthropic': minor
'@backstage/ai-node-provider-azure': minor
'@backstage/ai-node-provider-typesafe': minor
'@backstage/ai-node-provider-openrouter': minor
---

Added six provider packages for the managed AI service — `@backstage/ai-node-provider-google`, `-openai`, `-anthropic`, `-azure`, `-typesafe`, and `-openrouter` — each carrying one provider family's dispatch modules, extracted from the `@backstage/ai-node` core so that the core registers provider modules without shipping any. Every package exports its family's module collection for registration through the stock service factory's `providerModules` option (or any host's own composition); registration decides availability, so a family that is not registered fails closed exactly like an unlisted model.

The families: Google covers Gemini and Vertex AI, dispatching through the guarded worker transport that confines credentials and network access to the worker and settles in-flight work on worker loss; OpenAI covers the Responses, Chat Completions, and Codex chat transports plus the Decisions classifier module and the OAuth auth module for its token endpoints; Anthropic covers the Messages transport plus its OAuth auth module; Azure covers the Azure OpenAI Responses transport; TypeSafe covers the System One classification module; OpenRouter covers the image generation module over its chat-completions transport. Every module also declares the credential kinds its family consumes: Anthropic and the OpenAI chat transports accept both `api_key` and `oauth` (they ship the matching auth modules), while the Decisions classifier, Azure, Google, TypeSafe and OpenRouter accept `api_key` only. A configured or stored credential of a kind the resolved module does not declare is refused — at startup for installation config, at dispatch for personal stores — with guidance naming the supported kinds.

The auth modules are the guarded, journaled OAuth token-request implementations, and each family's provider module carries its auth module (`authModule`), so registering a family through the same `providerModules` surface registers its OAuth refresh path with it; the service wires pre-dispatch refresh from that plus the installation's configured token endpoints.

Each package builds on the `@backstage/ai-node` module-authoring entry point (`@backstage/ai-node/modules`), which exports the provider and auth module contracts, the shared request-envelope validator, and the OAuth token-request helpers. `@backstage/plugin-ai-backend` composes all six collections, so the backend plugin registers every family out of the box.
