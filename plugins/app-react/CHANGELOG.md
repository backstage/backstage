# @backstage/plugin-app-react

## 0.1.1-next.0

### Patch Changes

- 409af72: Internal refactor to move implementation of blueprints from `@backstage/frontend-plugin-api` to this package.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.0-next.0
  - @backstage/core-plugin-api@1.12.2-next.0

## 0.1.0

### Minor Changes

- 9ccf84e: Initial release of this web library for `@backstage/plugin-app`.

### Patch Changes

- 9ccf84e: Moved the following blueprints from `@backstage/frontend-plugin-api`:

  - `AppRootWrapperBlueprint`
  - `IconBundleBlueprint`
  - `NavContentBlueprint`
  - `RouterBlueprint`
  - `SignInPageBlueprint`
  - `SwappableComponentBlueprint`
  - `ThemeBlueprint`
  - `TranslationBlueprint`

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.3
