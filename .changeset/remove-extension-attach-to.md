---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the `ExtensionAttachTo` type export. Use `Extension<unknown>['attachTo']` if you need to reference the attachment type.
