---
'@backstage/integration': patch
---

Fixed GitHub App credentials from connections being reused across connections with the same host and App ID but a different private key, client credentials, or API base URL. A cached provider and its installation tokens are now only reused when all of these match, and rotating the private key takes effect without a restart.
