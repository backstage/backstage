---
'@backstage/plugin-lighthouse': patch
---

Strip trailing slash from url when creating a new audit. This change prevents duplicate audits from being displayed in the audit list.
