---
'@backstage/plugin-auth-backend': patch
---

Fixed CIMD redirect URI matching to allow any port for localhost addresses per RFC 8252 Section 7.3. Native CLI clients use ephemeral ports for OAuth callbacks, which are now accepted when the registered redirect URI uses a localhost address.
