---
'@backstage/cli': patch
---

Running `repo lint` with the `--successCache` flag now respects `.gitinore`, and it ignores projects without a `lint` script.
