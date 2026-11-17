---
'@backstage/connections': patch
---

Added opt-in support for URL-based connection definitions with a required instance URL and an optional API URL that defaults to the instance URL. Explicit API destinations are preserved, and both roots retain context paths and receive a trailing slash for resolving relative paths.

These definitions derive host identity internally for lookup and duplicate validation without exposing it in returned connection data. Existing connection types retain their current configuration and returned fields.
