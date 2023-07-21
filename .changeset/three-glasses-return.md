---
'@backstage/plugin-catalog-graph': patch
---

**BREAKING** The CatalogGraphCard now passes default maxDepth parameter to the ViewGraph link through catalogGraphParams. These changes are **required** to ` plugins/catalog-graph/src/components/CatalogGraphCard``diffconst catalogGraphParams = qs.stringify(    {      rootEntityRefs: [stringifyEntityRef(entity)],+     maxDepth: maxDepth,      unidirectional,      mergeRelations,      selectedKinds: kinds,      selectedRelations: relations,      direction,    },    { arrayFormat: 'brackets', addQueryPrefix: true },  ); `
