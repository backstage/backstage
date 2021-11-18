---
'@backstage/plugin-catalog-backend': patch
---

This fixes a bug where locations couldn't be added unless the processing engine is started.
It's now possible to run the catalog backend without starting the processing engine and still allowing locations registrations.

This is done by refactor the `EntityProvider.connect` to happen outside the engine.
