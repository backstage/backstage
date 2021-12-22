---
'@backstage/plugin-search-backend': minor
---

Search result location filtering

This change introduces a filter for search results based on their location protocol. The intention is to filter out unsafe or
malicious values before they can be consumed by the frontend. By default locations must be http/https URLs (or paths).
