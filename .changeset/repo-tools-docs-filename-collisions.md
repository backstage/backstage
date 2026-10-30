---
'@backstage/repo-tools': patch
---

The generated API reference documentation no longer overwrites pages when a package exports declarations whose names only differ in case, or that share a name but are of different kinds, for example a variable and an interface or namespace. One of them keeps the existing page, and the others get a page with their kind added to the filename, for example `-interface` or `-namespace`.
