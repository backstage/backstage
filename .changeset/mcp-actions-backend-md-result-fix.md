---
'@backstage/plugin-mcp-actions-backend': patch
---

Fixed an issue where actions returned Markdown-formatted JSON for Model Context Protocol responses. Responses now return plain JSON text (without Markdown code fences) and include a `structuredContent` field.
