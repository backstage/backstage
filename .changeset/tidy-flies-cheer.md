---
'@backstage/config': patch
---

Adds the ability to coerce values to their boolean representatives.
Values such as `"true"` `1` `on` and `y` will become `true` when using `getBoolean` and the opposites `false`.
This happens particularly when such parameters are used with environmental substitution as environment variables are always strings.
