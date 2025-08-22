---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-node': patch
---

Allow determining dependencies between catalog processors.

This change allows catalog processors to determine dependencies between each other, enabling more complex processing flows.
This is particularly useful for plugins that need to ensure certain processors run before others. To achieve this,
the `CatalogProcessor` interface has been extended with a new method `getDependencies()`, which returns an array of
processor names that this processor depends on. Alternatively, it's possible to use the
`catalog.processors.<processorName>.dependencies` configuration to specify dependencies. This is useful when working
with built-in or third-party processors that do not implement the `getDependencies()` method.
The config option takes precedence over the method.
