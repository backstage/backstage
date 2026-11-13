---
'@backstage/integration': patch
---

Fixed GitHub app credentials failing for every owner with `Cannot read properties of null (reading 'account')` when the list of app installations returned by GitHub contained null entries. Those entries are now ignored.
