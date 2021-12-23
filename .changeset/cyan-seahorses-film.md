---
'@backstage/core-plugin-api': minor
---

**BREAKING CHANGE** The `StorageApi` has received several updates that fills in gaps for some use-cases and makes it easier to avoid mistakes:

- The `StorageValueChange` type has been renamed to `StorageValueSnapshot`, the `newValue` property has been renamed to `value`, the stored value type has been narrowed to `JsonValue`, and it has received a new `presence` property that is `'unknown'`, `'absent'`, or `'present'`.
- The `get` method has been deprecated in favor of a new `snapshot` method, which returns a `StorageValueSnapshot`.
- The `observe$` method has had its contract changed. It should now emit values when the `presence` of a key changes, this may for example happen when remotely stored values are requested on page load and the presence switches from `'unknown'` to either `'absent'` or `'present'`.

The above changes have been made with deprecations in place to maintain much of the backwards compatibility for consumers of the `StorageApi`. The only breaking change is the narrowing of the stored value type, which may in some cases require the addition of an explicit type parameter to the `get` and `observe$` methods.
