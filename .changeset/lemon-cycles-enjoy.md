---
'@backstage/plugin-lighthouse': patch
---

Added more verbose components (used to render `null`) when no audits for a website corresponding to the provided url was found
Added `Create New Audit` button for the `AuditListForEntity` component used by `EntityLighthouseContent` and `EmbeddedRouter`
Removed error alert from `errorApi` if error was due to no audits being found for a website (empty database query result)
