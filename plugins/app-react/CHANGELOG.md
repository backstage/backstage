# @backstage/plugin-app-react

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.2-next.0
  - @backstage/core-plugin-api@1.12.4-next.0

## 0.2.0

### Minor Changes

- a2133be: Added new `NavContentNavItem`, `NavContentNavItems`, and `navItems` prop to `NavContentComponentProps` for auto-discovering navigation items from page extensions. The new `navItems` collection supports `take(id)` and `rest()` methods for placing specific items in custom sidebar positions, as well as `withComponent(Component)` which returns a `NavContentNavItemsWithComponent` for rendering items directly as elements. The existing `items` prop is now deprecated in favor of `navItems`.

### Patch Changes

- ef6916e: Added `IconElement` type as a replacement for the deprecated `IconComponent`. The `IconsApi` now has a new `icon()` method that returns `IconElement`, while the existing `getIcon()` method is deprecated. The `IconBundleBlueprint` now accepts both `IconComponent` and `IconElement` values.
- 409af72: Internal refactor to move implementation of blueprints from `@backstage/frontend-plugin-api` to this package.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.14.0
  - @backstage/core-plugin-api@1.12.3

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
