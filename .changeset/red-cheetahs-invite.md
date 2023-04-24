---
'@backstage/plugin-octopus-deploy': minor
---

Added support for Octopus Deploy spaces. The octopus.com/project-id annotation can now (optionally) be prefixed by a space identifier, for example. Spaces-1/Projects-102.
Also note that some of this plugins exported API's have changed to accommodate this change, changing from separate arguments to a single object.
