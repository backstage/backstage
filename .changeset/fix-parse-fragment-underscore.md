---
'@backstage/plugin-scaffolder': patch
---

Fixed parsing of Templating Extensions URL fragments so that an extension name containing underscores keeps its full name instead of being cut off at the first underscore. Added unit tests for the fragment helpers, which previously had none.
