---
'@backstage/config': patch
---

Reading a number from a configuration value that is an empty or whitespace-only string now fails with a clear conversion error, instead of silently returning `0`. Numeric strings, including ones with surrounding whitespace such as `'  42  '`, continue to be parsed as expected.
