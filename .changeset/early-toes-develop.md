---
'@backstage/plugin-techdocs-backend': minor
'@backstage/plugin-techdocs-node': minor
---

Allow prepared directory clean up for custom preparers

When using custom preparer for TechDocs, the `preparedDir` might
end up taking disk space. This requires all custom preparers to
implement a new method `shouldCleanPreparedDirectory` which indicates
whether the prepared directory should be cleaned after generation.
