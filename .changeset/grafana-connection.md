---
'@backstage/connections': patch
---

Added a Grafana connection type for authenticated instance APIs, with service-account tokens and self-hosted basic authentication. Connections support Grafana Cloud stacks and self-hosted base URLs, including subpaths.

Connections are identified by the instance base URL and can use a separate API base URL for backend requests. Both URL roots preserve installation paths and receive a trailing slash for relative requests.
