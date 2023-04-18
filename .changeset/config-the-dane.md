---
'@backstage/config-loader': minor
---

Configuration validation is now more permissive when it comes to config whose values are `string` but whose schemas declare them to be `boolean` or `number`.

For example, configuration was previously marked invalid when a string `'true'` was set on a property expecting type `boolean` or a string `'146'` was set on a property expecting type `number` (as when providing configuration via variable substitution sourced from environment variables). Now, such configurations will be considered valid and their values will be coerced to the right type at read-time.
