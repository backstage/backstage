---
'@backstage/plugin-scaffolder-backend': patch
---

Restore native boolean values for a single conditional statement with literal `true` or `false` branches, including nested conditionals, `elif`, and statements without an `else`. This prevents a rendered `false` from incorrectly running conditional steps, including when the value is passed through an action output. Adjacent blocks, interpolated branch values, and templates with surrounding text or whitespace keep their existing string rendering behavior.
