---
'@backstage/eslint-plugin': patch
---

Added new eslint rule to restrict mixed plugin imports.

New rule `@backstage/no-mixed-plugin-imports` disallows mixed imports between plugins that are mixing
the backstage architecture. This rule forces that:

- No imports from frontend plugins to backend plugins or other frontend plugins.
- No imports from backend plugins to frontend plugins or other backend plugins.
- No imports from common plugins to frontend or backend plugins.

The current recommended configuration is giving a warning for mixed imports. This is to be changed in
the future to an error so please adjust your workspace accordingly.
