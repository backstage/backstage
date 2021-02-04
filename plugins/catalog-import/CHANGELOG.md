# @backstage/plugin-catalog-import

## 0.3.7

### Patch Changes

- ceef4dd89: Export _api_ (Client, API, ref) from the catalog import plugin.
- b712841d6: Migrated to new composability API, exporting the plugin instance as `catalogImportPlugin`, and the page as `CatalogImportPage`.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [c4abcdb60]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [064c513e1]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [54c7d02f7]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/integration@0.3.2
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.3.6

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
- Updated dependencies [0b1182346]
  - @backstage/integration@0.3.1
  - @backstage/plugin-catalog@0.2.14

## 0.3.5

### Patch Changes

- 2b514d532: Modifying import functionality to register existing catalog-info.yaml if one exists in given GitHub repository
- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [0b135e7e0]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [fa8ba330a]
- Updated dependencies [a187b8ad0]
- Updated dependencies [ed6baab66]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/integration@0.3.0
  - @backstage/plugin-catalog@0.2.12

## 0.3.4

### Patch Changes

- 34a01a171: Improve how URLs are analyzed for add/import
- bc40ccecf: Add more generic descriptions for the catalog-import form.
- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- be5ac7fde: Remove dependency to `@backstage/plugin-catalog-backend`.
- Updated dependencies [466354aaa]
- Updated dependencies [f3b064e1c]
- Updated dependencies [c00488983]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/integration@0.2.0
  - @backstage/catalog-model@0.6.1
  - @backstage/plugin-catalog@0.2.11
  - @backstage/core@0.4.4

## 0.3.3

### Patch Changes

- edb7d0775: Create "url" type location when registering using the catalog-import plugin.
- Updated dependencies [99be3057c]
- Updated dependencies [49d2016a4]
- Updated dependencies [9c09a364f]
- Updated dependencies [73e75ea0a]
- Updated dependencies [036a84373]
- Updated dependencies [071711d70]
  - @backstage/plugin-catalog-backend@0.5.2
  - @backstage/plugin-catalog@0.2.10
  - @backstage/integration@0.1.5

## 0.3.2

### Patch Changes

- f3e75508d: Add description to Pull Request when registering a new component
- Updated dependencies [c6eeefa35]
- Updated dependencies [fb386b760]
- Updated dependencies [c911061b7]
- Updated dependencies [7c3ffc0cd]
- Updated dependencies [e7496dc3e]
- Updated dependencies [8ef71ed32]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [8dd0a906d]
- Updated dependencies [4eafdec4a]
- Updated dependencies [6b37c95bf]
- Updated dependencies [8c31c681c]
- Updated dependencies [7b98e7fee]
- Updated dependencies [178e09323]
- Updated dependencies [ac3560b42]
- Updated dependencies [0097057ed]
  - @backstage/plugin-catalog-backend@0.5.0
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/integration@0.1.4
  - @backstage/plugin-catalog@0.2.7

## 0.3.1

### Patch Changes

- 79418ddb6: Align plugin ID and fix variable typo
- d2938af4c: Add register existing component instructions
- Updated dependencies [6e8bb3ac0]
- Updated dependencies [2527628e1]
- Updated dependencies [e708679d7]
- Updated dependencies [047c018c9]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [38d63fbe1]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/plugin-catalog-backend@0.4.0
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.0

### Minor Changes

- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

### Patch Changes

- Updated dependencies [b4488ddb0]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [e42402b47]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/plugin-catalog-backend@0.3.0
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5
