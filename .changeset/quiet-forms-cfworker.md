---
'@backstage/plugin-home': patch
'@backstage/plugin-scaffolder': patch
---

Form validation now uses a JSON Schema validator that doesn't generate code at runtime, so these forms no longer need `'unsafe-eval'` in your Content Security Policy. Validation error messages may be worded differently than before.
