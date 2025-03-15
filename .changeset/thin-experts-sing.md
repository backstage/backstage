---
'@backstage/core-compat-api': patch
---

The `convertLegacyApp` has received the following changes:

- `null` routes will now be ignored.
- Converted routes no longer need to belong to a plugin, falling back to a `converted-orphan-routes` plugin instead.
- The generate layout override extension is now properly attached to the `app/root` extension.
- Converted root elements are now automatically wrapped with `compatWrapper`.
