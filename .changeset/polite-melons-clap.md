---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: Removed the export of the `RecursivePartial` utility type. If you relied on this type it can be redefined like this:

```ts
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
```
