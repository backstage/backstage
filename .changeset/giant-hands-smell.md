---
'@backstage/plugin-catalog-backend': patch
'@backstage/catalog-model': patch
'@backstage/plugin-catalog-node': patch
---

Adds an optional expectations field to setFieldValidators(). It provides custom expectation messages that will be shown upon failure for the associated field type.

```diff
catalogModel.setFieldValidators(
    {
    // This is only one of many methods that you can pass into
    // setFieldValidators; your editor of choice should help you
    // find the others. The length checks and regexp inside are
    // just examples and can be adjusted as needed, but take care
    // to test your changes thoroughly to ensure that you get
    // them right.
    isValidEntityName(value) {
        return (
            typeof value === 'string' &&
            value.length >= 1 &&
            value.length <= 63 &&
            /^[A-Za-z0-9]+$/.test(value)
        );
    },
    },
+    {
+   // Optional: provide custom expectation messages that will be
+   // shown when validation fails. This helps users understand
+   // what format is expected for your custom validators.
+    isValidEntityName:
+   'a string of 1-63 characters containing only letters and numbers.',
+    },
);
```
