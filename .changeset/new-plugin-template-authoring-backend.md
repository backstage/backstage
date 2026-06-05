---
'@backstage/plugin-template-authoring-backend': minor
---

Introduce `@backstage/plugin-template-authoring-backend`, a backend plugin that generates Backstage scaffolder Template entities (v1beta3) from a natural-language description plus optional reference templates pulled from the catalog. Uses the AI SDK `generateObject` helper with a zod schema so the LLM is constrained to a valid Template shape — `metadata.name` must be kebab-case, every `spec.steps[].action` must be in a curated catalog of well-known scaffolder action ids, and `spec.steps` must be non-empty. Exposes `POST /api/template-authoring/v1/generate` returning `{yaml, template, citations, warnings}`. Includes a semantic post-validator that checks step-ref resolution and ordering hints (`fetch:*` first, `catalog:register` after `publish:*`). Aligns with BEP-0015 (#33906) for a contained refactor when the AI Provider Service lands.
