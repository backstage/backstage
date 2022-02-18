---
'@backstage/integration': patch
---

Fixed bug in integration package where Self Hosted GitLab instances with custom ports weren't supported (because of the lack of an option to add the port in the integration configs. Now users can add the port directly in the host)
