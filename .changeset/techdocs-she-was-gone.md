---
'@backstage/plugin-techdocs': patch
---

TechDocs now uses a "safe by default" sanitization library, rather than relying on its own, hard-coded list of allowable tags and attributes.
