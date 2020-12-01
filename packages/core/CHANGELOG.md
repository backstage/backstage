# @backstage/core

## 0.3.2

### Patch Changes

- 475fc0aaa: Clear sidebar search field once a search is executed

## 0.3.1

### Patch Changes

- 1722cb53c: Added configuration schema

## 0.3.0

### Minor Changes

- 199237d2f: New DependencyGraph component added to core package.

### Patch Changes

- 7b37d65fd: Adds the MarkdownContent component to render and display Markdown content with the default
  [GFM](https://github.github.com/gfm/) (Github flavored Markdown) dialect.

  ```
  <MarkdownContent content={markdownGithubFlavored} />
  ```

  To render the Markdown content with plain [CommonMark](https://commonmark.org/), set the dialect to `common-mark`

  ```
  <MarkdownContent content={markdown} dialect='common-mark />
  ```

- 4aca74e08: Extend default config loader to read config from the window object.

  Config will be read from `window.__APP_CONFIG__` which should be an object.

- e8f69ba93: - The BottomLink is now able to handle with internal routes.
  - @backstage/core Link component detect whether it's an external link or not, and render accordingly
- 0c0798f08: Extend the table to share its current filter state. The filter state can be used together with the new `useQueryParamState` hook to store the current filter state to the browser history and restore it after navigating to other routes.
- 0c0798f08: Make the selected state of Select and CheckboxTree controllable from outside.
- 6627b626f: Fix divider prop not respected on InfoCard
- Updated dependencies [c5bab94ab]
- Updated dependencies [4577e377b]
  - @backstage/core-api@0.2.1
  - @backstage/theme@0.2.1

## 0.2.0

### Minor Changes

- 819a70229: Add SAML login to backstage

  ![](https://user-images.githubusercontent.com/872486/92251660-bb9e3400-eeff-11ea-86fe-1f2a0262cd31.png)

  ![](https://user-images.githubusercontent.com/872486/93851658-1a76f200-fce3-11ea-990b-26ca1a327a15.png)

- 482b6313d: Fix dense in Structured Metadata Table
- 1c60f716e: Added EmptyState component
- b79017fd3: Updated the `GithubAuth.create` method to configure the default scope of the Github Auth Api. As a result the
  default scope is configurable when overwriting the Core Api in the app.

  ```
  GithubAuth.create({
    discoveryApi,
    oauthRequestApi,
    defaultScopes: ['read:user', 'repo'],
  }),
  ```

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

### Patch Changes

- ae5983387: Fix banner position and color

  This PR closes: #2245

  The "fixed" props added to control the position of the banner. When it is set to true the banner will be shown in bottom of that page and the width will be based on the content of the message.

  ![](https://user-images.githubusercontent.com/15106494/93765685-999df480-fc15-11ea-8fa5-11cac5836cf1.png)

  ![](https://user-images.githubusercontent.com/15106494/93765697-9e62a880-fc15-11ea-92af-b6a7fee4bb21.png)

- 144c66d50: Fixed banner component position in DismissableBanner component
- 93a3fa3ae: Add forwardRef to the SidebarItem
- 782f3b354: add test case for Progress component
- 2713f28f4: fix the warning of all the core components test cases
- 406015b0d: Update ItemCard headers to pass color contrast standards.
- 82759d3e4: rename stories folder top Chip
- ac8d5d5c7: update the test cases of CodeSnippet component
- ebca83d48: add test cases for Status components
- aca79334f: update ItemCard component and it's story
- c0d5242a0: Proper render boolean values on StructuredMetadataTable component
- 3beb5c9fc: make ErrorPage responsive + fix the test case
- 754e31db5: give aria-label attribute to Status Ok, Warning and Error
- 1611c6dbc: fix the responsive of page story
- Updated dependencies [819a70229]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [cbbd271c4]
- Updated dependencies [b79017fd3]
- Updated dependencies [26e69ab1a]
- Updated dependencies [cbab5bbf8]
  - @backstage/core-api@0.2.0
  - @backstage/theme@0.2.0
