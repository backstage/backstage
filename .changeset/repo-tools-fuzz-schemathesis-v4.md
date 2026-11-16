---
'@backstage/repo-tools': patch
---

Fixed the `--limit` and `--debug` options of `package schema openapi fuzz` failing with Schemathesis 4. The command requires Schemathesis 4 or newer; upgrade an older install with `python -m pip install "schemathesis>=4"`.
