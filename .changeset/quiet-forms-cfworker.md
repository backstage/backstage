---
'@backstage/plugin-home': patch
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-react': patch
---

Form validation now uses a JSON Schema validator that doesn't generate code at runtime, so these forms no longer need `'unsafe-eval'` in your Content Security Policy. Validation error messages may be worded differently than before, and the `params` of each validation error are no longer populated, except `missingProperty` for missing required fields. Custom `transformErrors` code that reads `params` needs to be updated. The `email`, `uri`, `date`, `time`, `date-time`, `hostname`, `ipv4`, `ipv6`, `uuid` and `regex` formats are still checked, along with `color` and `data-url`, but less common formats such as `idn-email`, `iri` or `int32` are now ignored. Custom messages that templates set with the `errorMessage` keyword still work, except for message templates such as `${/path}`.
