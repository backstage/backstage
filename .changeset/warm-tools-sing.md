---
'@backstage/plugin-notifications-backend-module-email': patch
---

Hardened notification email delivery with format validation and optional `allowedEmailDomains`. Invalid or disallowed addresses are skipped; `allowlistEmailAddresses` still overrides the domain list, and `denylistEmailAddresses` wins last.
