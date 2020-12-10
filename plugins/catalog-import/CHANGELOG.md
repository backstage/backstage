# @backstage/plugin-catalog-import

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
