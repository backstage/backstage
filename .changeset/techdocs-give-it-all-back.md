---
'@backstage/techdocs-common': minor
---

TechDocs has dropped all support for the long-ago deprecated git-based common
prepares as well as all corresponding values in `backstage.io/techdocs-ref`
annotations.

Entities whose `backstage.io/techdocs-ref` annotation values still begin with
`github:`, `gitlab:`, `bitbucket:`, or `azure/api:` will no longer be generated
by TechDocs. Be sure to update these values so that they align with their
expected format and your usage of TechDocs.

For details, see [this explainer on TechDocs ref annotation values][how].

[how]: https://backstage.io/docs/features/techdocs/how-to-guides#how-to-understand-techdocs-ref-annotation-values
