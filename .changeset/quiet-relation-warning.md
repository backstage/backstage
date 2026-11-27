---
'@backstage/plugin-catalog': patch
---

The entity relation warning no longer lists the names of related entities that can't be found. These can be entities the current user isn't allowed to see, so the warning now only shows how many of each kind there are, and mentions that missing access is a possible cause.
