---
'@backstage/plugin-adr': patch
'@backstage/plugin-adr-backend': patch
---

The ADR plugin can now work with sites other than GitHub. Expanded the ADR backend plugin to provide endpoints to facilitate this and changed EntityAdrContent and AdrReader to take an optional property, adrFileFetcher, to allow switching between the new implementation and the octokit one. By default, the octokit version is used.
