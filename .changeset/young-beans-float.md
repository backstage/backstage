---
'@backstage/plugin-lighthouse': minor
---

Require @backstage/plugin-lighthouse-common package where API implementation moved to.

Following types have been moved to @backstage/plugin-lighthouse-common:

- Audit = AuditRunning | AuditFailed | AuditCompleted
- AuditBase
- AuditCompleted
- AuditFailed
- AuditRunning
- FetchError
- LASListRequest
- LASListResponse
- LighthouseApi
- LighthouseCategoryAbbr
- LighthouseCategoryId
- LighthouseConfigSettings
- LighthouseRestApi
- TriggerAuditPayload
- Website
- WebsiteListResponse
