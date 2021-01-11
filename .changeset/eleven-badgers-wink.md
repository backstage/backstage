---
'@backstage/techdocs-common': patch
'@backstage/plugin-techdocs-backend': patch
---

Improve techdocs-common Generator API for it to be used by techdocs-cli. TechDocs generator.run function now takes
an input AND an output directory. Most probably you use techdocs-common via plugin-techdocs-backend, and so there
is no breaking change for you.
But if you use techdocs-common separately, you need to create an output directory and pass into the generator.
