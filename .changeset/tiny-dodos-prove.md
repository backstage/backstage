---
'@backstage/frontend-test-utils': patch
---

Refactor `.make` method on Blueprints into two different methods, `.make` and `.makeWithOverrides`.

When using `createExtensionBlueprint` you can define parameters for the factory function, if you wish to take advantage of these parameters you should use `.make` when creating an extension instance of a Blueprint. If you wish to override more things other than the standard `attachTo`, `name`, `namespace` then you should use `.makeWithOverrides` instead.

`.make` is reserved for simple creation of extension instances from Blueprints using higher level parameters, whereas `.makeWithOverrides` is lower level and you have more control over the final extension.
