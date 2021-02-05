# @backstage/core

## 0.6.0

### Minor Changes

- 21e624ba9: Closes #3556
  The scroll bar of collapsed sidebar is now hidden without full screen.

  ![image](https://user-images.githubusercontent.com/46953622/105390193-0bfd0080-5c19-11eb-8e86-2161bbe6e8d9.png)

### Patch Changes

- 12ece98cd: Add className to the SidebarItem
- d82246867: Update `WarningPanel` component to use accordion-style expansion
- 5fa3bdb55: Add `href` in addition to `onClick` to `ItemCard`. Ensure that the height of a
  `ItemCard` with and without tags is equal.
- da9f53c60: Add a `prop` union for `SignInPage` that allows it to be used for just a single provider, with inline errors, and optionally with automatic sign-in.
- 32c95605f: Fix check that determines whether popup was closed or the messaging was misconfigured.
- 54c7d02f7: Introduce `TabbedLayout` for creating tabs that are routed.

  ```typescript
  <TabbedLayout>
    <TabbedLayout.Route path="/example" title="Example tab">
      <div>This is rendered under /example/anything-here route</div>
    </TabbedLayout.Route>
  </TabbedLayout>
  ```

- Updated dependencies [c810082ae]
  - @backstage/theme@0.2.3

## 0.5.0

### Minor Changes

- efd6ef753: Removed `InfoCard` variant `height100`, originally deprecated in [#2826](https://github.com/backstage/backstage/pull/2826).

  If your component still relies on this variant, simply replace it with `gridItem`.

- a187b8ad0: Removed deprecated `router.registerRoute` method in `createPlugin`.

  Deprecated `router.addRoute` method in `createPlugin`.

  Replace usage of the above two components with a routable extension.

  For example, given the following:

  ```ts
  import { createPlugin } from '@backstage/core';
  import { MyPage } from './components/MyPage';
  import { rootRoute } from './routes';

  export const plugin = createPlugin({
    id: 'my-plugin',
    register({ router }) {
      router.addRoute(rootRoute, MyPage);
    },
  });
  ```

  Migrate to

  ```ts
  import { createPlugin, createRoutableExtension } from '@backstage/core';
  import { rootRoute } from './routes';

  export const plugin = createPlugin({
    id: 'my-plugin',
    routes: {
      root: rootRoute,
    },
  });

  export const MyPage = plugin.provide(
    createRoutableExtension({
      component: () => import('./components/MyPage').then(m => m.MyPage),
      mountPoint: rootRoute,
    }),
  );
  ```

  And then use `MyPage` like this in the app:

  ```tsx
  <FlatRoutes>
  ...
    <Route path='/my-path' element={<MyPage />}>
  ...
  </FlatRoutes>
  ```

## 0.4.4

### Patch Changes

- 265a7ab30: Fix issue where `SidebarItem` with `onClick` and without `to` renders an inaccessible div. It now renders a button.

## 0.4.3

### Patch Changes

- a08c32ced: Add `FlatRoutes` component to replace the top-level `Routes` component from `react-router` within apps, removing the need for manually appending `/*` to paths or sorting routes.
- Updated dependencies [a08c32ced]
- Updated dependencies [86c3c652a]
- Updated dependencies [27f2af935]
  - @backstage/core-api@0.2.8

## 0.4.2

### Patch Changes

- 1dc445e89: Update to use new plugin extension API
- 342270e4d: Create AboutCard in core and use it in pagerduty and catalog plugin
- Updated dependencies [d681db2b5]
- Updated dependencies [1dc445e89]
  - @backstage/core-api@0.2.7

## 0.4.1

### Patch Changes

- 8ef71ed32: Add a `<Avatar>` component to `@backstage/core`.
- Updated dependencies [7dd2ef7d1]
  - @backstage/core-api@0.2.6

## 0.4.0

### Minor Changes

- ff243ce96: Introducing a new optional property within `app-config.yaml` called `auth.environment` to have configurable environment value for `auth.providers`

  **Default Value:** 'development'

  **Optional Values:** 'production' | 'development'

  **Migration-steps:**

  - To override the default value, one could simply introduce the new property `environment` within the `auth` section of the `config.yaml`
  - re-run the build to reflect the changed configs

### Patch Changes

- 2527628e1: Link `component` prop now accepts any element type.
- 1c69d4716: Fix React warning of descendant paragraph tag
- 04f26f88d: Export the `defaultConfigLoader` implementation
- Updated dependencies [b6557c098]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [d8d5a17da]
- Updated dependencies [1665ae8bb]
- Updated dependencies [e3bd9fc2f]
  - @backstage/core-api@0.2.5
  - @backstage/config@0.1.2
  - @backstage/theme@0.2.2

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
  [GFM](https://github.github.com/gfm/) (GitHub Flavored Markdown) dialect.

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
- b79017fd3: Updated the `GithubAuth.create` method to configure the default scope of the GitHub Auth Api. As a result the
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
