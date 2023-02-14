---
'@backstage/plugin-auth-backend': patch
---

The `microsoft` (i.e. Azure) auth provider now supports negotiating tokens for
Azure resources besides Microsoft Graph (e.g. AKS, Virtual Machines, Machine
Learning Services, etc.). When the `/frame/handler` endpoint is called with an
authorization code for a non-Microsoft Graph scope, the user profile will not be
fetched. Similarly no user profile or photo data will be fetched by the backend
if the `/refresh` endpoint is called with the `scope` query parameter strictly
containing scopes for resources besides Microsoft Graph.
