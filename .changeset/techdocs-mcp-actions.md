---
'@backstage/plugin-techdocs-backend': minor
---

Added MCP (Model Context Protocol) actions for TechDocs backend plugin.

This adds two new actions that can be used by AI assistants to interact with TechDocs:

- `get-techdocs-metadata`: Retrieves metadata for a TechDocs site including site name, description, and navigation structure (5MB limit, 15s timeout)
- `get-techdocs-content`: Fetches the content of a specific TechDocs page (10MB limit, 30s timeout)

Both actions include memory optimization with size limits and request timeouts to prevent resource exhaustion.
