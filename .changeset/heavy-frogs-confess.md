---
'@backstage/plugin-search-backend-node': patch
---

Fix the scheduler "max listeners exceeded" warning by having "abort controllers" per task instead of having a single one for all tasks (previously we used the same controller for all collators, logging the warning every time we had more than 10 collators running in parallel).
