---
'@backstage/plugin-catalog': patch
---

The entity `<AboutCard />` now uses an external route ref to link to TechDocs
sites. This external route must now be bound in order for the "View TechDocs"
link to continue working. See the [create-app changelog][cacl] for details.

[cacl]: https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md
