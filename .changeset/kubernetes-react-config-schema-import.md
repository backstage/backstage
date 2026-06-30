---
'@backstage/plugin-kubernetes-react': patch
---

Fixed the published configuration schema so that it no longer references a file that is excluded from the package. This previously caused configuration schema extraction to fail in apps that depend on this plugin.
