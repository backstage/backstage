---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed distributed actions not being visible in the scaffolder template actions.

Depending on the plugin startup order, some of the distributed actions were not being registered correctly,
causing them to be invisible in the scaffolder template actions list.
