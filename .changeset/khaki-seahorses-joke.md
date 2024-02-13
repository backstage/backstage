---
'@backstage/integration-aws-node': patch
'@backstage/integration': patch
---

All single-line secrets read from config will now have both leading and trailing whitespace trimmed. This is done to ensure that the secrets are always valid HTTP header values, since many fetch implementations will include the header value itself when an error is thrown due to invalid header values.
