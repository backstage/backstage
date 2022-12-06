---
'@backstage/plugin-search-backend-node': patch
---

Fixed a bug that could cause a `max listeners exceeded warning` to be logged when more than 10 collators were running simultaneously.
