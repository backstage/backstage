# @backstage/plugin-catalog

## 0.3.0

### Minor Changes

- 019fe39a0: `@backstage/plugin-catalog` stopped exporting hooks and helpers for other
  plugins. They are migrated to `@backstage/plugin-catalog-react`.
  Change both your dependencies and imports to the new package.

### Patch Changes

- 7fc89bae2: Display owner and system as entity page links in the tables of the `api-docs`
  plugin.

  Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
  `@backstage/plugin-catalog-react` and export it from there to use it by other
  plugins.

- b37501a3d: Add `children` option to `addPage`, which will be rendered as the children of the `Route`.
- b37501a3d: Finalize migration to new composability API, with the plugin instance now exported `catalogPlugin`.
- 54c7d02f7: Introduce `TabbedLayout` for creating tabs that are routed.

  ```typescript
  <TabbedLayout>
    <TabbedLayout.Route path="/example" title="Example tab">
      <div>This is rendered under /example/anything-here route</div>
    </TabbedLayout.Route>
  </TabbedLayout>
  ```

- Updated dependencies [720149854]
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [019fe39a0]
- Updated dependencies [11cb5ef94]
  - @backstage/plugin-scaffolder@0.4.2
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.2.14

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- 0b1182346: Add `EntityRefLinks` that shows one or multiple entity ref links.

  Change the about card and catalog table to use `EntityRefLinks` due to the
  nature of relations to support multiple relations per type.

- Updated dependencies [9dd057662]
  - @backstage/plugin-scaffolder@0.4.1

## 0.2.13

### Patch Changes

- a4e636c8f: Hide the kind of owners in the about card if it's the default kind (group)
- 099c5cf4f: Show the parent component in the about card (via partOf relationship)
- a08db734c: Remove the `WelcomeBanner` that links to a plugin that is not longer wired into Backstage instances

## 0.2.12

### Patch Changes

- 593632f07: Derive the list of to-delete entities in the `UnregisterEntityDialog` from the `backstage.io/managed-by-origin-location` annotation.
  The dialog also rejects deleting entities that are created by the `bootstrap:bootstrap` location.
- 33846acfc: Display the owner, system, and domain as links to the entity pages in the about card.
  Only display fields in the about card that are applicable to the entity kind.
- f04db53d7: Display systems in catalog table and make both owner and system link to the entity pages.
  The owner field is now taken from the relations of the entity instead of its spec.
- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [a187b8ad0]
- Updated dependencies [ed6baab66]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-scaffolder@0.4.0
  - @backstage/catalog-client@0.3.5

## 0.2.11

### Patch Changes

- c00488983: Enable catalog table actions for all location types.

  The edit button has had support for other providers for a while and there is
  no specific reason the View in GitHub cannot work for all locations. This
  change also replaces the GitHub icon with the OpenInNew icon.

- Updated dependencies [f3b064e1c]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/core@0.4.4

## 0.2.10

### Patch Changes

- 9c09a364f: Remove the unused dependency to `@backstage/plugin-techdocs`.
- Updated dependencies [8e083f41f]
- Updated dependencies [947d3c269]
  - @backstage/plugin-scaffolder@0.3.6

## 0.2.9

### Patch Changes

- 7e0b8cac5: Add `CatalogIndexPage` and `CatalogEntityPage`, two new extensions that replace the existing `Router` component.

  Add `EntityLayout` to replace `EntityPageLayout`, using children instead of an element property, and allowing for collection of all `RouteRef` mount points used within tabs.

  Add `EntitySwitch` to be used to select components based on entity data, along with accompanying `isKind`, `isNamespace`, and `isComponentType` filters.

- 87c0c53c2: Add new `EntityProvider` component, which can be used to provide an entity for the `useEntity` hook.
- Updated dependencies [a08c32ced]
- Updated dependencies [359f9d2d8]
  - @backstage/core@0.4.3
  - @backstage/plugin-techdocs@0.5.2

## 0.2.8

### Patch Changes

- 342270e4d: Create AboutCard in core and use it in pagerduty and catalog plugin
- Updated dependencies [19554f6d6]
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
  - @backstage/plugin-scaffolder@0.3.5
  - @backstage/core@0.4.2
  - @backstage/plugin-techdocs@0.5.1

## 0.2.7

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [dae4f3983]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/plugin-techdocs@0.5.0
  - @backstage/core@0.4.1
  - @backstage/catalog-client@0.3.4
  - @backstage/plugin-scaffolder@0.3.4

## 0.2.6

### Patch Changes

- 6011b7d3e: Added pagerduty plugin to example app
- Updated dependencies [2527628e1]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [87a33d2fe]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/catalog-model@0.5.0
  - @backstage/plugin-techdocs@0.4.0
  - @backstage/theme@0.2.2
  - @backstage/plugin-scaffolder@0.3.3
  - @backstage/catalog-client@0.3.3

## 0.2.5

### Patch Changes

- ebf37bbae: Use the OWNED_BY relation and compare it to the users MEMBER_OF relation. The user entity is searched by name, based on the userId of the identity.
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [da2ad65cb]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-scaffolder@0.3.2
  - @backstage/plugin-techdocs@0.3.1
  - @backstage/catalog-client@0.3.2

## 0.2.4

### Patch Changes

- 6f70ed7a9: Replace usage of implementsApis with relations
- Updated dependencies [4b53294a6]
- Updated dependencies [ab94c9542]
- Updated dependencies [2daf18e80]
- Updated dependencies [069cda35f]
  - @backstage/plugin-techdocs@0.3.0
  - @backstage/catalog-model@0.3.1

## 0.2.3

### Patch Changes

- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [ef2831dde]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-scaffolder@0.3.1
  - @backstage/catalog-client@0.3.1
  - @backstage/plugin-techdocs@0.2.3

## 0.2.2

### Patch Changes

- 8b7737d0b: Add About Card tooltips
- Updated dependencies [1722cb53c]
- Updated dependencies [717e43de1]
  - @backstage/core@0.3.1
  - @backstage/plugin-techdocs@0.2.2
  - @backstage/catalog-client@0.3.0

## 0.2.1

### Patch Changes

- 2d0bd1be7: Improved the edit link to open the component yaml in edit mode in corresponding SCM. Broke out logic for createEditLink to be reused.
- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [59166e5ec]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-scaffolder@0.3.0
  - @backstage/plugin-techdocs@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI
- 368fd8243: Created EntityNotFound component for catalog which displays the 404 page when entity is not found.

  Fixes #2266

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

- f0aa01bcc: Add client side paging for catalog table
- 8b9c8196f: Locations registered through the catalog client now default to the 'url' type. The type selection dropdown in the register-component form has been removed.
- 2ebcfac8d: Add a validate button to the register-component page

  This allows the user to validate his location before adding it.

- 0b956f21b: The URL path for a catalog entity has changed,

  - from: `/catalog/:kind/:optionalNamespaceAndName`
  - to: `/catalog/:namespace/:kind/:name`

  Redirects are in place, so disruptions for users should not happen.

### Patch Changes

- 0aecfded0: handle the case where no entities are available to show
- 60d40892c: Remove "in default" in component name
- 97c2cb19b: update the EntityNotFound component
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [8351ad79b]
- Updated dependencies [fb74f1db6]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [c5ef12926]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [1c8c43756]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [57b54c8ed]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-scaffolder@0.2.0
  - @backstage/plugin-techdocs@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
