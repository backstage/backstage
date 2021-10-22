# @backstage/core-components

## 0.7.1

### Patch Changes

- e535ea766a: Switched to relying on the built-in support for async loading in `react-syntax-highlighter`. This should provide further improvements to async rendering and lazy loading, and avoid test flakiness that was happening because of the significant number or resources being loaded in lazily all at once.
- 2023a9683f: Fixed invalid wrap in DismissableBanner component
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/errors@0.1.3
  - @backstage/core-plugin-api@0.1.11

## 0.7.0

### Minor Changes

- 5c42360577: Add documentation and more type safety around DependencyGraph
- a20cbf00d2: The syntax highlighting library used by the `CodeSnippet` component is now lazy loaded. This most likely has no effect on existing code, but may break tests as the content of the `CodeSnippet` is now rendered asynchronously.

### Patch Changes

- 75bc878221: Internal refactor to avoid importing all of `@material-ui/core`.
- 6ec56d5a57: update the null check to use the optional chaining operator in case of non-null assertion operator is not working in function extractInitials(values: string)
- 81c2a1af86: Resolve a warning in `<Button>` related to not using `React.forwardRef`.
- 53470ada54: Fix search in Firefox. When the search was performed by pressing enter, the query parameter was first set but then reverted back.
- b488d8b69f: Change the Table search field placeholder to "Filter" and change icon accordingly

  We had feedback that users expected the catalog table search field to have more sophisticated behaviour
  than simple filtering. This change sets the search field placeholder to read "Filter"
  to avoid confusion with the search feature. The icon is updated to match. This change is applied
  generally in core-components so this change is made consistently across the app given the search
  field is present on all pages via the sidebar.

- 2435d7a49b: Deprecated HomepageTimer in favor of HeaderWorldClock which is found in the [home plugin](https://github.com/backstage/backstage/tree/master/plugins/home)
- Updated dependencies
  - @backstage/theme@0.2.11

## 0.6.1

### Patch Changes

- f139fed1ac: The `<Link />` component now automatically instruments all link clicks using
  the new Analytics API. Each click triggers a `click` event, containing the
  text of the link the user clicked on, as well as the location to which the user
  clicked. In addition, these events inherit plugin/extension-level metadata,
  allowing clicks to be attributed to the plugin/extension/route containing the
  link:

  ```json
  {
    "action": "click",
    "subject": "Text content of the link that was clicked",
    "attributes": {
      "to": "/value/of-the/to-prop/passed-to-the-link"
    },
    "context": {
      "extension": "ExtensionInWhichTheLinkWasClicked",
      "pluginId": "plugin-in-which-link-was-clicked",
      "routeRef": "route-ref-in-which-the-link-was-clicked"
    }
  }
  ```

- 666e1f478e: Provide a clearer error message when a authentication provider used by the `SignInPage` has not been configured to support sign-in.
- 63d426bfeb: Wrap up the `Link` component in a component to reset the color so that we can actually see the button text
- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.
- 162e1eee65: SignInPage: move the initial invocation of `login` away from the render method
- Updated dependencies
  - @backstage/core-plugin-api@0.1.10

## 0.6.0

### Minor Changes

- 21767b08ca: Checkbox tree filters are no longer available in the Table component:

  - Deleted the `CheckboxTree` component
  - Removed the filter type `'checkbox-tree'` from the `TableFilter` types.

### Patch Changes

- 9c3cb8d4e2: Stop forcing `target="_blank"` in the `SupportButton` but instead use the default logic of the `Link` component, that opens external targets in a new window and relative targets in the same window.
- d21e39e303: Support `material-ui` overrides in Backstage internal components
- c4e77bb34a: Added documentation for exported symbols.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.9

## 0.5.0

### Minor Changes

- 537bd04005: Fixed a popup-blocking bug affecting iOS Safari in SignInPage.tsx by ensuring that the popup occurs in the same tick as the tap/click

### Patch Changes

- c0eb1fb9df: Allow to configure zooming for `<DependencyGraph>`. `zoom` can either be
  `enabled`, `disabled`, or `enable-on-click`. The latter requires the user to
  click into the diagram to enable zooming.
- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/config@0.1.10

## 0.4.2

### Patch Changes

- 60c03f69a7: Change the styling of the `<DependencyGraph>` to have more contrast in light
  mode. Nodes now have a design similar to material UI buttons.
- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- d9f2ff12bb: Deprecated CheckboxTree component. Deprecated the filter type `'checkbox-tree'` from the `TableFilter` types.
- 61e9fcf406: Improve UX for Login pop-up
- 005510dabe: remove hard coded min height in page header
- Updated dependencies
  - @backstage/core-plugin-api@0.1.8

## 0.4.1

### Patch Changes

- 06e275705: Fix warning produced by BottomLink component

  During development, we noticed warnings such as:

  ```
  react_devtools_backend.js:2842 Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
  ```

  The BottomLink component renders a Box component within a Typography component which leads to a div tag within a p tag.
  This change inverts that ordering without changing the visual appearance.

- Updated dependencies
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9
  - @backstage/core-plugin-api@0.1.7

## 0.4.0

### Minor Changes

- 3ed78fca3: Changed the `titleComponent` prop on `ContentHeader` to accept `ReactNode` instead of a React `ComponentType`. Usages of this prop should be converted from passing a component to passing in the rendered element:

  ```diff
  -<ContentHeader titleComponent={MyComponent}>
  +<ContentHeader titleComponent={<MyComponent />}>
  ```

### Patch Changes

- e0a6aea82: Bumped `react-hook-form` to `^7.12.2`

## 0.3.3

### Patch Changes

- d041655a7: Fix accessibility issue in `<CopyTextButton />`. The component doesn't render anymore an hidden `textarea` containing the text to be copied.
- 6d76bca85: Handle changes to nodes passed into `<DependencyGraph>` correctly.
- Updated dependencies
  - @backstage/config@0.1.8

## 0.3.2

### Patch Changes

- a3f3cff3b: Change the default hover experience for the sidebar to be not jumpy & add visual separation between sidebar & Entity Page tabs for dark mode.
- 6b1afe8c0: Add a configurable `palette.bursts.gradient` property to the Backstage theme, to support customizing the gradients in the `ItemCard` header.
- Updated dependencies
  - @backstage/config@0.1.7
  - @backstage/theme@0.2.10

## 0.3.1

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- 55a5dbd54: Fix for `SidebarItem` matching the active route too broadly.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.6

## 0.3.0

### Minor Changes

- 7bf006210: Remove unused props from InfoCard prop type

### Patch Changes

- c4d8ff963: Switched frontend identity code to use `token` instead of the deprecated `idToken` field
- 7b8aa8d0d: Move the `CreateComponentButton` from the catalog plugin to the `core-components` & rename it to `CreateButton` to be reused inside the api-docs plugin & scaffolder plugin, but also future plugins. Additionally, improve responsiveness of `CreateButton` & `SupportButton` by shrinking them to `IconButtons` on smaller screens.
- 260c053b9: Fix All Material UI Warnings
- Updated dependencies
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5

## 0.2.0

### Minor Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes

### Patch Changes

- 19d9995b6: Improve accessibility of core & catalog components by adjusting them with non-breaking changes.
- 224e54484: Added an `EntityProcessingErrorsPanel` component to show any errors that occurred when refreshing an entity from its source location.

  If upgrading, this should be added to your `EntityPage` in your Backstage application:

  ```diff
  // packages/app/src/components/catalog/EntityPage.tsx

  const overviewContent = (
  ...
            <EntityOrphanWarning />
          </Grid>
         </EntitySwitch.Case>
      </EntitySwitch>
  +   <EntitySwitch>
  +     <EntitySwitch.Case if={hasCatalogProcessingErrors}>
  +       <Grid item xs={12}>
  +         <EntityProcessingErrorsPanel />
  +       </Grid>
  +     </EntitySwitch.Case>
  +   </EntitySwitch>

  ```

  Additionally, `WarningPanel` now changes color based on the provided severity.

- Updated dependencies
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.1.6

### Patch Changes

- 9a751bb28: Increase the vertical padding of the sidebar search input field to match the height of the parent anchor tag. This prevents users from accidentally navigating to the search page when they actually wanted to use the search input directly.
- 45b5fc3a8: Updated the layout of catalog and API index pages to handle smaller screen sizes. This adds responsive wrappers to the entity tables, and switches filters to a drawer when width-constrained. If you have created a custom catalog or API index page, you will need to update the page structure to match the updated [catalog customization](https://backstage.io/docs/features/software-catalog/catalog-customization) documentation.
- 03bf17e9b: Improve the responsiveness of the EntityPage UI. With this the Header component should scale with the screen size & wrapping should not cause overflowing/blocking of links. Additionally enforce the Pages using the Grid Layout to use it across all screen sizes & to wrap as intended.

  To benefit from the improved responsive layout, the `EntityPage` in existing Backstage applications should be updated to set the `xs` column size on each grid item in the page, as this does not default. For example:

  ```diff
  -  <Grid item md={6}>
  +  <Grid item xs={12} md={6}>
  ```

## 0.1.5

### Patch Changes

- a446bffdb: Improve UX of the Sidebar by adding SidebarScrollWrapper component allowing the user to scroll through Plugins & Shortcuts on smaller screens. Prevent the Sidebar from opening on click on small devices
- f11e50ea7: - Enhanced core `Button` component to open external links in new tab.
  - Replaced the use of `Button` component from material by `core-components` in tools card.
- 76bb7aeda: Show scroll bar of the sidebar wrapper only on hover
- 2a13aa1b7: Handle empty code blocks in markdown files so they don't fail rendering
- 47748c7e6: Fix error in error panel, and console warnings about DOM nesting pre inside p
- 34352a79c: Add edit button to Group Profile Card
- 612e25fd7: Add custom styles to scroll bar of the sidebar wrapper to fix flaky behaviour

## 0.1.4

### Patch Changes

- f423891ee: Fixed sizing of the System diagram when the rendered graph was wider than the container.
- 3db266fe4: Make `ErrorBoundary` display more helpful information about the error that
  occurred.

  The `slackChannel` (optional) prop can now be passed as an object on the form
  `{ name: string; href?: string; }` in addition to the old string form. If you
  are using the error boundary like

  ```tsx
  <ErrorBoundary slackChannel="#support">
    <InnerComponent>
  </ErrorBoundary>
  ```

  you may like to migrate it to

  ```tsx
  const support = {
    name: '#support',
    href: 'https://slack.com/channels/your-channel',
  };

  <ErrorBoundary slackChannel={support}>
    <InnerComponent>
  </ErrorBoundary>
  ```

  Also deprecated the prop `slackChannel` on `TabbedCard` and `InfoCard`, while
  adding the prop `errorBoundaryProps` to replace it.

- e8c65b068: Clear the previously selected sign-in provider on failure

## 0.1.3

### Patch Changes

- d2c31b132: Add title prop in SupportButton component
- d4644f592: Use the Backstage `Link` component in the `Button`

## 0.1.2

### Patch Changes

- e47336ea4: Use app.title for helmet in header
- 75b8537ce: This change adds automatic error boundaries around extensions.

  This means that all exposed parts of a plugin are wrapped in a general error boundary component, that is plugin aware. The default design for the error box is borrowed from `@backstage/errors`. To override the default "fallback", one must provide a component named `ErrorBoundaryFallback` to `createApp`, like so:

  ```ts
  const app = createApp({
    components: {
      ErrorBoundaryFallback: props => {
        // a custom fallback component
        return (
          <>
            <h1>Oops.</h1>
            <h2>
              The plugin {props.plugin.getId()} failed with{' '}
              {props.error.message}
            </h2>
            <button onClick={props.resetError}>Try again</button>
          </>
        );
      },
    },
  });
  ```

  The props here include:

  - `error`. An `Error` object or something that inherits it that represents the error that was thrown from any inner component.
  - `resetError`. A callback that will simply attempt to mount the children of the error boundary again.
  - `plugin`. A `BackstagePlugin` that can be used to look up info to be presented in the error message. For instance, you may want to keep a map of your internal plugins and team names or slack channels and present these when an error occurs. Typically, you'll do that by getting the plugin ID with `plugin.getId()`.

- Updated dependencies [75b8537ce]
- Updated dependencies [da8cba44f]
  - @backstage/core-plugin-api@0.1.2

## 0.1.1

### Patch Changes

- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [031ccd45f]
- Updated dependencies [e7c5e4b30]
  - @backstage/core-plugin-api@0.1.1
  - @backstage/theme@0.2.8
