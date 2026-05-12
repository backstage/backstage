---
'@backstage/plugin-auth-node': minor
---

Added `UpstreamRefreshRegistry` for registering upstream auth provider refresh, start, and authenticate capabilities. This allows CIMD/DCR offline sessions to trigger fresh upstream OAuth flows and validate against the upstream provider on every refresh. The registry is automatically populated during provider router setup when an `upstreamRefreshRegistry` is passed to the provider factory.
