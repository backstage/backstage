---
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-catalog-react': patch
---

Introduce new cards to `@backstage/plugin-catalog` that can be added to entity pages:

- `EntityHasSystemsCard` to display systems of a domain.
- `EntityHasComponentsCard` to display components of a system.
- `EntityHasSubcomponentsCard` to display subcomponents of a subcomponent.
- In addition, `EntityHasApisCard` to display APIs of a system is added to `@backstage/plugin-api-docs`.

`@backstage/plugin-catalog-react` now provides an `EntityTable` to build own cards for entities.
The styling of the tables and new cards was also applied to the existing `EntityConsumedApisCard`,
`EntityConsumingComponentsCard`, `EntityProvidedApisCard`, and `EntityProvidingComponentsCard`.
