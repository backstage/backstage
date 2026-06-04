# Catalog Assistant Backend

A Backstage backend plugin that answers natural-language questions about the
Software Catalog using an LLM, grounded on catalog entities.

Ask things like:

- _"Who owns the payments service?"_
- _"What services depend on auth-db?"_
- _"Which components are tagged `tier-1` and use Postgres?"_

The plugin retrieves the top-N relevant catalog entities for a question,
builds a grounded prompt, and asks Claude to answer using only those entities
as the source of truth. The response includes the entity refs cited as
context so the caller can verify or link them.

## Status

First slice. Backend HTTP endpoint only, no UI. Retrieval is keyword /
substring scoring across entity name, title, description, tags, kind, and
spec.type — intentionally simple and deterministic, no embedding store
required. Designed to be swapped behind the same `CatalogContextRetriever`
interface for semantic retrieval later.

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-catalog-assistant-backend
```

Register the plugin:

```ts
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-catalog-assistant-backend'));
```

## Configuration

```yaml
catalogAssistant:
  # Defaults to 'claude-sonnet-4-6'
  model: claude-sonnet-4-6
  # Or pass via ANTHROPIC_API_KEY env var
  anthropicApiKey: ${ANTHROPIC_API_KEY}
  # Defaults to 20
  maxContextEntities: 20
  # Defaults to 1024
  maxOutputTokens: 1024
```

`anthropicApiKey` is marked `secret` in the config schema; provide it via env
var in production.

## API

### `POST /api/catalog-assistant/v1/query`

Request:

```json
{ "question": "who owns the payments service?" }
```

Response:

```json
{
  "answer": "The payments service is owned by group:default/platform.",
  "citations": ["component:default/payments-api", "api:default/payments"]
}
```

Authentication uses the standard Backstage `httpAuth` service and accepts
either a user or service credential.

## Architecture

```
┌──────────────────┐    ┌──────────────────────────┐    ┌────────────────┐
│ HTTP /v1/query   │ ─▶ │ CatalogContextRetriever  │ ─▶ │ Catalog API    │
└──────────────────┘    │  (keyword + scoring)     │    └────────────────┘
        │               └──────────────────────────┘
        ▼
┌──────────────────┐    ┌──────────────────────────┐
│ QueryService     │ ─▶ │ Vercel AI SDK            │
│  (build prompt)  │    │  generateText({ system,  │
└──────────────────┘    │    prompt, model: ... }) │
                        └──────────────────────────┘
```

The LLM call uses `@ai-sdk/anthropic` + `ai`'s `generateText`, deliberately
matching the surface area proposed in
[BEP-0015: AI Model Provider Service](https://github.com/backstage/backstage/pull/33906).
When the AI Provider Service lands as a core extension point, replacing
`generateText` with `provider.getLanguageModelFactory()(modelId)` is a small,
contained refactor.

## Why this is the _inverse_ of `mcp-actions-backend`

- `mcp-actions-backend` exposes Backstage's actions as **MCP tools** so
  external AI agents can act on the catalog.
- `catalog-assistant-backend` consumes the catalog **from within Backstage**
  via an LLM call, so a human (or another Backstage plugin) can query it.

Both feed off the same underlying catalog; the audiences are opposite.

## Limitations

- **No conversation memory.** Each request is one-shot.
- **Keyword retrieval only.** Compound questions ("services tagged X that
  depend on Y") are answered as well as the LLM can reason over the retrieved
  page; there is no graph traversal at retrieval time.
- **No tool use.** The LLM cannot fetch additional entities mid-answer.
  Once tool-use ships via BEP-0015, the assistant will be able to follow
  relations on demand.
- **No streaming.** v1 returns the full response in one body. SSE / streaming
  will land alongside the chat UI plugin.
