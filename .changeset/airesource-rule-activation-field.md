---
'@backstage/catalog-model': minor
---

Added optional `activation` field to the `@alpha` AiResource rule spec. The field is a harness-discriminated array that describes how a rule is activated in different agent harnesses (e.g. Claude Code, Cursor, Codex), each with its native configuration.
