---
'@backstage/integration': patch
---

GitHub integrations now cache the list of app installations for a short period, avoiding a full `GET /app/installations` pagination on every token fetch. This significantly reduces API usage against the 15k/hour GitHub App rate limit for organizations with many installations or frequent credential refreshes.

The cache is refreshed on a 10-minute TTL, and is additionally invalidated when a lookup for a previously-unseen owner occurs (throttled to once per minute) or when GitHub reports that a cached installation is no longer available, so newly added or removed installations are still picked up promptly.
