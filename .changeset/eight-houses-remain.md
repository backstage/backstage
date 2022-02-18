---
'@backstage/plugin-scaffolder-backend': patch
---

- **DEPRECATED** - `TaskState` has been deprecated in favour of `CurrentClaimedTask`
- Narrowed the types from `JSONValue` to `JSONObject` as the usage is and should always be `JSONObject` for `complete` and `emitLog` `metadata` in `TaskContext`
