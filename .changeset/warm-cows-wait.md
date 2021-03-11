---
'@backstage/plugin-jenkins': minor
---

Changed the way project slug is extracted from an entity. Up until now, the plugin assumed that the project slug is always of the format "owner/repo". However, this is not something that is enforced by Jenkins and sometimes the project name doesn't contain an owner.
Since this split is not used anywhere and the entire project slug is always used as-is, removed this distinction and just read the project slug from the annotation as-is.
