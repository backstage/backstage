---
'@backstage/backend-test-utils': minor
---

Exports a new `captureAuditor()` helper that records all audit events emitted through an auditor service instance, including the full initiated/succeeded/failed lifecycle and merged metadata, so that tests can assert directly against the emitted events.
