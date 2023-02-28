---
'@backstage/plugin-linguist-backend': patch
---

Allow kind to be configurable

```ts
return createRouter({ schedule: schedule, kind: ['Component'] }, { ...env });
```
