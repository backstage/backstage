---
'@backstage/eslint-plugin': patch
---

Added new eslint rule to restrict mixed plugin imports.

New rule `@backstage/no-mixed-plugin-imports` disallows mixed imports between plugins that are mixing
the backstage architecture. This rule forces that:

- No imports from frontend plugins to backend plugins or other frontend plugins.
- No imports from backend plugins to frontend plugins or other backend plugins.
- No imports from common plugins to frontend or backend plugins.
