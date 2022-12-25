---
'@backstage/config': patch
---

Handle a case when boolean configuration parameters are given a string type of 'true' or 'false'. This happens particularly when such parameters are used with environmental substitution as environment variables are always strings.
