---
'@backstage/plugin-home': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-react': patch
---

Form validation now uses a JSON Schema validator that doesn't generate code at runtime, so these forms no longer need `'unsafe-eval'` in your Content Security Policy. Validation error messages may be worded differently than before. Custom messages that templates set with the `errorMessage` keyword still work, except for message templates such as `${/path}`.
