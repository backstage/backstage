---
'@backstage/plugin-catalog-backend': patch
---

Now when entities are deleted, the parent entity state is updated such that it will "heal" accidental deletes on the next refresh round.
