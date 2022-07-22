---
'@backstage/plugin-shortcuts': minor
---

Internal observable replaced with a mapping from the storage API. This fixes shortcuts initialization when using firestore.

`ShortcutApi.get` method, that returns an immediate snapshot of shortcuts, made public.

Example of how to get and observe `shortcuts`:

```typescript
const shortcutApi = useApi(shortcutsApiRef);
const shortcuts = useObservable(shortcutApi.shortcut$(), shortcutApi.get());
```
