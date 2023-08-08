---
'@backstage/plugin-techdocs': minor
'@backstage/plugin-catalog': minor
---

This change allows a new annotation of `backstage.io/techdocs-external-ref` this ref allows you to reference another entity for its TechDocs. This allows you have a single TechDoc for all items in a system, for example you might have a frontend and a backend in the same repo. This would allow you to have TechDocs build under a `System` entity while referencing the system e.g.: `backstage.io/techdocs-external-ref: system:default/example` that will show the systems docs in both the TechDocs button and the TechDocs tab without needing to do duplicate builds and filling the TechDocs page with garbage.
