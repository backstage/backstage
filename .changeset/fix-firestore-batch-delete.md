---
'@backstage/plugin-auth-backend': patch
---

Optimized `FirestoreKeyStore.removeKeys` to use Firestore batched writes instead of sequential individual deletes, reducing N network round-trips to ⌈N/500⌉.
