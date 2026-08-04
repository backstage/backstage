---
'@backstage/catalog-model': minor
---

Added optional `activation` field to the `@alpha` AiResource rule spec. The field is a harness-discriminated array that describes how a rule is activated in the supported agent harnesses (Claude Code, Cursor, Codex), each with its native configuration. Entries are validated against the set of supported harnesses.
