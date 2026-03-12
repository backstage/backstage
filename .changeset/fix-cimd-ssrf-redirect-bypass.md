---
'@backstage/plugin-auth-backend': patch
---

Fixed a security vulnerability where the CIMD metadata fetch could follow HTTP redirects to internal hosts, bypassing SSRF protections.
