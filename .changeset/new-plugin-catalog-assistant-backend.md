---
'@backstage/plugin-catalog-assistant-backend': minor
---

Introduce `@backstage/plugin-catalog-assistant-backend`, a backend plugin that answers natural-language questions about the Software Catalog using an LLM grounded on catalog entities. Exposes `POST /api/catalog-assistant/v1/query`, retrieves the top-N relevant entities via deterministic keyword scoring, and calls Claude through `@ai-sdk/anthropic` to produce a concise grounded answer with entity-ref citations. Designed so the LLM call can later be routed through the AI Provider Service proposed in BEP-0015 (#33906) with a contained refactor.
