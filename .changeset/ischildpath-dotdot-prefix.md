---
'@backstage/cli-common': patch
---

Fixed path containment checks so that files and directories whose name begins with two dots (for example `..data`) are now correctly recognized as being inside their parent directory. Paths that genuinely step outside the parent directory continue to be rejected.
