---
'@backstage/cli-node': patch
---

Added command-granular composition of CLI module aggregates. Modules provided individually can override matching commands from an aggregate while unrelated aggregate commands remain available, and conflicts at the same composition level are reported.
