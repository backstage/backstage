---
'@backstage/cli': patch
---

- remove unused dependencies `winston` and `yn` from the template of backend plugins;
- update `msw` to version `2.3.1` in the template of backend plugins;
  starting with v1 and switching later to v2 is tedious and not straight forward; it's easier to start with v2;
