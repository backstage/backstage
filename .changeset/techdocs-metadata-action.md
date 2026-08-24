---
'@backstage/plugin-techdocs-backend': minor
---

Added a `get-techdocs-metadata` action to the TechDocs backend plugin, registered with the Actions Registry Service (alpha).

The action retrieves metadata for a TechDocs site — site name, description, and navigation structure — so AI assistants can discover the available documentation pages and understand the site structure before fetching content. Responses are capped at 5MB with a 15s request timeout to prevent resource exhaustion.
