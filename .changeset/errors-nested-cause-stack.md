---
'@backstage/errors': patch
---

Fixed `serializeError` so that stack traces are stripped from all nested error causes when stacks are not requested, not just the first-level cause.
