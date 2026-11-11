---
'@backstage/plugin-scaffolder-react': patch
---

The review step now applies `ui:backstage.review.mask`, `ui:backstage.review.show: false`, `ui:widget: password` and `ui:field: Secret` to fields and items nested inside arrays and inside objects with `ui:backstage.review.explode: false`. Previously these nested values were shown in clear text.
