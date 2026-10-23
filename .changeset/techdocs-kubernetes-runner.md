---
'@backstage/plugin-techdocs-node': minor
'@backstage/plugin-techdocs-backend': minor
---

TechDocs can now generate documentation in Kubernetes Jobs. Set `techdocs.generator.runIn` to `kubernetes` and configure `techdocs.generator.kubernetes` with the PersistentVolumeClaim that Backstage and the build Jobs share. See [How to run TechDocs builds as Kubernetes Jobs](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-run-techdocs-builds-as-kubernetes-jobs) for the setup steps and the [configuration reference](https://backstage.io/docs/features/techdocs/configuration#kubernetes) for all options.
