---
'@backstage/plugin-catalog-backend-module-azure': patch
---

Catalog locations constructed by the Azure DevOps catalog module — the entity provider, the `azure-discovery` location processor, and the webhook-driven SCM events — now encode the repository file path as a URL query parameter value. Previously, file names containing characters that are special in a URL query string (such as `&`, `#`, or `=`) could produce a location URL that points at a different file or branch than the one that was discovered. Because the `azure-discovery` processor emitted its locations without any encoding before, locations of that processor for files or branches whose names contain spaces, `+`, or non-ASCII characters change once on upgrade.
