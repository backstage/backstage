---
'@backstage/plugin-scaffolder-backend-module-confluence-to-markdown': minor
---

Prefer page ID for Confluence fetch with fallback to title+space in `confluence:transform:markdown`.

- When the input URL contains `spaces/{space}/pages/{id}/{title}`, the action now fetches the page by ID first
  using `/rest/api/content/{id}?expand=body.export_view`.
- If fetching by ID fails, or when the URL does not contain an ID, the action falls back to the existing
  exact title + space lookup using `/rest/api/content?title=...&spaceKey=...&expand=body.export_view`.
- Attachments, Markdown conversion, and mkdocs navigation update behavior are unchanged.

This improves reliability for pages where the URL slug does not exactly match the Confluence title
(for example, titles with emoji or special characters), while preserving compatibility with existing inputs.
