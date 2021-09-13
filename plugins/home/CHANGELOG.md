# @backstage/plugin-home

## 0.3.0

### Minor Changes

- 7f00902d9: Rename RandomJokeHomePageComponent to HomePageRandomJoke to fit convention, and update example app accordingly.
  **NOTE**: If you're using the RandomJoke component in your instance, it now has to be renamed to `HomePageRandomJoke`

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.1
  - @backstage/core-plugin-api@0.1.7

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.0

## 0.2.0

### Minor Changes

- 2b7d3455b: Create the `Home` plugin which exports some basic functionality that's used to compose a homepage. An example of a composed homepage is added to the example app.

  This change also introduces the `createCardExtension` which creates a lazy loaded card that is intended to be used for homepage components.

  Adoption of this homepage requires setup similar to what can be found in the example app.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.2
  - @backstage/theme@0.2.10
