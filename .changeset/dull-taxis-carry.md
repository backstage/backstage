---
'@backstage/plugin-adr': minor
'@backstage/plugin-adr-backend': patch
---

The ADR plugin can now work with sites other than GitHub. Expanded the ADR backend plugin to provide endpoints to facilitate this.

**BREAKING** The ADR plugin now uses UrlReaders. You will have to [configure integrations](https://backstage.io/docs/integrations/index#configuration) for all sites you want to get ADRs from. If you would like to create your own implementation that has different behavior, you can override the AdrApi [just like you can with other apis.](https://backstage.io/docs/api/utility-apis#app-apis) The previously used Octokit implementation has been completely removed.
