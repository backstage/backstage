---
'@backstage/plugin-circleci': patch
---

Fixed a bug in the `CircleCI` plugin where restarting builds was hard-coded to GitHub rather than introspecting the entity source location.
