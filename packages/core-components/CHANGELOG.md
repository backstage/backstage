# @backstage/core-components

## 0.9.6-next.0

### Patch Changes

- c3cfc83af2: Updated JSDoc to be MDX compatible.

## 0.9.5

### Patch Changes

- feb4e8de07: Fix EntityPage tab scrolling overflow bug on Firefox
- 65840b17be: Fix issue where right arrow icon was incorrectly added to side bar items without a sub-menu
- de593ec78f: Updated dependency `react-text-truncate` to `^0.19.0`.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 6968b65ba1: Updated dependency `@react-hookz/web` to `^14.0.0`.
- ee2cd642c5: Updated dependency `rc-progress` to `3.3.3`.
- 96d1e01641: Accessibility updates:

  - Added `aria-label` to the `Select` component
  - Changed heading level used in the header of `Table` component

- 7d355c4b3f: Fix the missing filter in the toolbar when passing a custom component in the core-components Table
- 1cf9caecd6: fix Sidebar Contexts deprecation message
- bff65e6958: The `SidebarPinStateContext` and `SidebarContext` have been deprecated and will be removed in a future release. Instead, use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()`.

  This was done to ensure that sidebar state can be shared successfully across components exported by different packages, regardless of what version of this package is resolved and installed for each individual package.

- Updated dependencies
  - @backstage/core-plugin-api@1.0.3

## 0.9.5-next.2

### Patch Changes

- ee2cd642c5: Updated dependency `rc-progress` to `3.3.3`.
- 1cf9caecd6: fix Sidebar Contexts deprecation message

## 0.9.5-next.1

### Patch Changes

- feb4e8de07: Fix EntityPage tab scrolling overflow bug on Firefox
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- bff65e6958: The `SidebarPinStateContext` and `SidebarContext` have been deprecated and will be removed in a future release. Instead, use `<SidebarPinStateProvider>` + `useSidebarPinState()` and/or `<SidebarOpenStateProvider>` + `useSidebarOpenState()`.

  This was done to ensure that sidebar state can be shared successfully across components exported by different packages, regardless of what version of this package is resolved and installed for each individual package.

- Updated dependencies
  - @backstage/core-plugin-api@1.0.3-next.0

## 0.9.5-next.0

### Patch Changes

- 65840b17be: Fix issue where right arrow icon was incorrectly added to side bar items without a sub-menu
- 6968b65ba1: Updated dependency `@react-hookz/web` to `^14.0.0`.
- 96d1e01641: Accessibility updates:

  - Added `aria-label` to the `Select` component
  - Changed heading level used in the header of `Table` component

## 0.9.4

### Patch Changes

- ac19f82936: Added ARIA landmark <main> to Page component and added ARIA landmark <nav> to DesktopSidebar and Sidebar components
- 55f68c386a: Enabled select component to be enabled by keyboard
- c0055ece91: Announce external links to screen readers
- e210c0cab8: Add ability to customize `Read More` destination with `readMoreUrl` prop for `MissingAnnotationEmptyState` component.
- 52c02ac02b: Don't set the background color on an Avatar component that has a picture.
- cfc0f2e5bd: Added optional anchorOrigin alignment prop to AlertDisplay
- f4380eb602: Add an aria-label to the support button to improve accessibility for screen readers
- ba97b80421: Updated dependency `@types/react-syntax-highlighter` to `^15.0.0`.
- e462112be5: Updated dependency `rc-progress` to `3.3.2`.
- 2bcb0a0e2b: Sidebar NAV now includes aria-label. Component AboutField now uses h2 variant instead of subtitle2 (font properties unchanged)
- c7f32b53a4: Fixed multiple scrolls appearing on Page when added InfoCard with external bottom link
- 3603014e0e: Add ARIA landmark( <main>), & label and a heading to OAuthRequestDialog. Removed nested interactive control (button).
- 2025d7c123: Properly highlight `SidebarSubmenuItem` dropdown items on hover, use ellipsis styling on long labels in `SidebarSubmenu`, allow `icon` and `to` properties to be optional on `SidebarSubmenuItem`, and fix `SidebarPage` padding to be responsive to pinned state
- 2295b4ab2b: Add controls to Storybook stories
- 521293b22e: Added a chevron Indicator when the sidebar is collapsed and has a sub-menu
- Updated dependencies
  - @backstage/core-plugin-api@1.0.2
  - @backstage/config@1.0.1

## 0.9.4-next.2

### Patch Changes

- 52c02ac02b: Don't set the background color on an Avatar component that has a picture.
- 3603014e0e: Add ARIA landmark( <main>), & label and a heading to OAuthRequestDialog. Removed nested interactive control (button).
- 2025d7c123: Properly highlight `SidebarSubmenuItem` dropdown items on hover, use ellipsis styling on long labels in `SidebarSubmenu`, allow `icon` and `to` properties to be optional on `SidebarSubmenuItem`, and fix `SidebarPage` padding to be responsive to pinned state

## 0.9.4-next.1

### Patch Changes

- 55f68c386a: Enabled select component to be enabled by keyboard
- ba97b80421: Updated dependency `@types/react-syntax-highlighter` to `^15.0.0`.
- 2bcb0a0e2b: Sidebar NAV now includes aria-label. Component AboutField now uses h2 variant instead of subtitle2 (font properties unchanged)
- Updated dependencies
  - @backstage/config@1.0.1-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 0.9.4-next.0

### Patch Changes

- ac19f82936: Added ARIA landmark <main> to Page component and added ARIA landmark <nav> to DesktopSidebar and Sidebar components
- c0055ece91: Announce external links to screen readers
- cfc0f2e5bd: Added optional anchorOrigin alignment prop to AlertDisplay
- f4380eb602: Add an aria-label to the support button to improve accessibility for screen readers
- Updated dependencies
  - @backstage/core-plugin-api@1.0.2-next.0

## 0.9.3

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 25b8e8d5b5: Add BackstageTab to overridableComponents so can override styles in a theme
- 230ad0826f: Bump to using `@types/node` v16
- 41fd107189: Exported `IdentityProviders` type.
- a13604b8f7: Adding a name to the core-components Tab styles so can customise in the theme settings
- 19648d5cf5: fix support config ref to use backstage/backstage
- d505e43ffc: Fix highlighting of active sidebar items.
- 72f3dfd05a: Updated ProxiedSignInPageProps docs
- 7741e47eae: `<Sidebar />` now accepts additional props `sidebarOptions` and `submenuOptions` to allow further customization
- Updated dependencies
  - @backstage/core-plugin-api@1.0.1

## 0.9.3-next.2

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- 41fd107189: Exported `IdentityProviders` type.
- d505e43ffc: Fix highlighting of active sidebar items.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.1-next.0

## 0.9.3-next.1

### Patch Changes

- 25b8e8d5b5: Add BackstageTab to overridableComponents so can override styles in a theme
- a13604b8f7: Adding a name to the core-components Tab styles so can customise in the theme settings
- 72f3dfd05a: Updated ProxiedSignInPageProps docs
- 7741e47eae: `<Sidebar />` now accepts additional props `sidebarOptions` and `submenuOptions` to allow further customization

## 0.9.3-next.0

### Patch Changes

- 19648d5cf5: fix support config ref to use backstage/backstage

## 0.9.2

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- 7c8cde4aa1: Change header style `word-wrap` from `break-all` to `break-word`
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-plugin-api@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0

## 0.9.1

### Patch Changes

- 23568dd328: chore(deps): bump `@react-hookz/web` from 12.3.0 to 13.0.0
- 95667624c1: Add names to sidebar sub menu styles for customization

## 0.9.1-next.0

### Patch Changes

- 23568dd328: chore(deps): bump `@react-hookz/web` from 12.3.0 to 13.0.0
- 95667624c1: Add names to sidebar sub menu styles for customization

## 0.9.0

### Minor Changes

- af5eaa87f4: **BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).

### Patch Changes

- 64b430f80d: chore(deps): bump `react-text-truncate` from 0.17.0 to 0.18.0
- bb2bb36651: Updated usage of `StorageApi` to use `snapshot` method instead of `get`
- 689840dcbe: Added ability for SidebarSubmenuItem to handle external links correctly via the "to" prop
- Updated dependencies
  - @backstage/core-plugin-api@0.8.0

## 0.8.10

### Patch Changes

- d91d22bb19: When clicking on a log line the URL will be updated from `/task/uid` to
  `/task/uid/#line-1`. This URL are also sharable, meaning that the UI will
  highlight the log line in the hash of the URL.
- Updated dependencies
  - @backstage/core-plugin-api@0.7.0

## 0.8.9

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 126074a04b: Port supported react-use functions to react-hookz.
- Updated dependencies
  - @backstage/core-plugin-api@0.6.1
  - @backstage/errors@0.2.1
  - @backstage/config@0.1.14
  - @backstage/theme@0.2.15

## 0.8.8

### Patch Changes

- 8d785a0b1b: chore: bump `ansi-regex` from `5.0.1` to `6.0.1`
- f2dfbd3fb0: Adjust ErrorPage to accept optional supportUrl property to override app support config. Update type of additionalInfo property to be ReactNode to accept both string and component.
- 19155e0939: Updated React component type declarations to avoid exporting exotic component types.
- 89c84b9108: chore: fixing typescript errors for `TabbedCard.tsx` for React 17.x
- d62bdb7a8e: The `ErrorPage` now falls back to using the default support configuration if the `ConfigApi` is not available.

## 0.8.8-next.0

### Patch Changes

- 8d785a0b1b: chore: bump `ansi-regex` from `5.0.1` to `6.0.1`
- f2dfbd3fb0: Adjust ErrorPage to accept optional supportUrl property to override app support config. Update type of additionalInfo property to be ReactNode to accept both string and component.
- d62bdb7a8e: The `ErrorPage` now falls back to using the default support configuration if the `ConfigApi` is not available.

## 0.8.7

### Patch Changes

- f7257dff6f: The `<Link />` component now accepts a `noTrack` prop, which prevents the `click` event from being captured by the Analytics API. This can be used if tracking is explicitly not warranted, or in order to use custom link tracking in specific situations.
- 4c773ed25c: Change subtitle of Header style to use palette.bursts.fontColor
- f465b63b7f: Fix an issue where changes related to the `MobileSidebar` prevented scrolling pages. Additionally improve the menu of the `MobileSidebar` to not overlay the `BottomNavigation`.
- 064e750a50: Adding hover message to the Gauge and an info icon to the GaugeCard.
- a681cb9c2f: Make linkTarget configurable for MarkdownContent component

## 0.8.7-next.1

### Patch Changes

- f7257dff6f: The `<Link />` component now accepts a `noTrack` prop, which prevents the `click` event from being captured by the Analytics API. This can be used if tracking is explicitly not warranted, or in order to use custom link tracking in specific situations.

## 0.8.7-next.0

### Patch Changes

- 4c773ed25c: Change subtitle of Header style to use palette.bursts.fontColor
- f465b63b7f: Fix an issue where changes related to the `MobileSidebar` prevented scrolling pages. Additionally improve the menu of the `MobileSidebar` to not overlay the `BottomNavigation`.
- a681cb9c2f: Make linkTarget configurable for MarkdownContent component

## 0.8.6

### Patch Changes

- b97a2460d5: Remove the `ignoreChildEvent` utility from the sidebar component to avoid conflicts with popovers
- bdc53553eb: chore(deps): bump `react-text-truncate` from 0.16.0 to 0.17.0
- 05f0f44180: chore(deps): bump `remark-gfm` from 2.0.0 to 3.0.1
- 15bac1d738: chore(deps): bump `react-markdown` from 7.1.2 to 8.0.0
- 7346b5fb96: chore(deps): bump `rc-progress` from 3.1.4 to 3.2.4
- 9abb28bb22: Fix issue where component types are not recognized causing the `MobileSidebar` to not render as intended.
- 1787694435: Updates styling of Header component by removing flex wrap and add max width of characters for subtitle

## 0.8.5

### Patch Changes

- 306d879536: chore(deps): bump `react-syntax-highligher` and `swagger-ui-react`
- 6b05ad1265: Updated the `SignInPage`, `ProxiedSignInPage` and `UserIdentity` implementations to match the removals of the deprecated `IdentityApi` methods and types.
- 8bb0f4bc8a: - Add `useContent` hook to have a reference to the current main content element
  - Sets the main content reference on `Content` component
- 7ba416be78: The `Bar` component will now render a `MobileSidebar` instead of the current sidebar on smaller screens. The state of the `MobileSidebar` will be treated as always open.

  ***

  **Add MobileSidebar:** A navigation component, which sticks to the bottom. If there is no content in the Sidebar, it won't be rendered. If there are `children` in the `Sidebar`, but no `SidebarGroup`s as `children`, it will render all `children` into a default overlay menu, which can be displayed by clicking a menu item. If `SidebarGroup`s are provided, it will render them in the bottom navigation. Additionally, a `MobileSidebarContext`, which wraps the component, will save the selected menu item.

  **Add SidebarGroup:** Groups items of the `Sidebar` together. On bigger screens, this won't have any effect at the moment. On smaller screens, it will render a given icon into the `MobileSidebar`. If a route is provided, clicking the `SidebarGroup` in the `MobileSidebar` will route to the page. If no route is provided, it will add a provided icon to the `MobileSidebar` as a menu item & will render the children into an overlay menu, which will be displayed when the menu item is clicked.

- Updated dependencies
  - @backstage/core-plugin-api@0.6.0
  - @backstage/config@0.1.13

## 0.8.5-next.0

### Patch Changes

- 306d879536: chore(deps): bump `react-syntax-highligher` and `swagger-ui-react`
- 6b05ad1265: Updated the `SignInPage`, `ProxiedSignInPage` and `UserIdentity` implementations to match the removals of the deprecated `IdentityApi` methods and types.
- 7ba416be78: The `Bar` component will now render a `MobileSidebar` instead of the current sidebar on smaller screens. The state of the `MobileSidebar` will be treated as always open.

  ***

  **Add MobileSidebar:** A navigation component, which sticks to the bottom. If there is no content in the Sidebar, it won't be rendered. If there are `children` in the `Sidebar`, but no `SidebarGroup`s as `children`, it will render all `children` into a default overlay menu, which can be displayed by clicking a menu item. If `SidebarGroup`s are provided, it will render them in the bottom navigation. Additionally, a `MobileSidebarContext`, which wraps the component, will save the selected menu item.

  **Add SidebarGroup:** Groups items of the `Sidebar` together. On bigger screens, this won't have any effect at the moment. On smaller screens, it will render a given icon into the `MobileSidebar`. If a route is provided, clicking the `SidebarGroup` in the `MobileSidebar` will route to the page. If no route is provided, it will add a provided icon to the `MobileSidebar` as a menu item & will render the children into an overlay menu, which will be displayed when the menu item is clicked.

- Updated dependencies
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0

## 0.8.4

### Patch Changes

- 6415189d99: Add a `ProxiedSignInPage` that can be used e.g. for GCP IAP and AWS ALB
- de2396da24: Create a short delay when `<SidebarSubmenu/>` is opened
- 5333451def: Cleaned up API exports
- e2eb92c109: Updated `ResponseErrorPanel` to not use the deprecated `data` property of `ResponseError`.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/core-plugin-api@0.5.0
  - @backstage/errors@0.2.0

## 0.8.3

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1

## 0.8.2

### Patch Changes

- 73a91e25f9: Added description to components: BottomLink, Breadcrumbs, BrokenImageIcon, CardTab, Content, ContentHeader, EmptyState, ErrorPage, FeatureCalloutCircular, Gauge, GaugeCard, Header, HeaderIconLinkRow, HeaderLabel, HeaderTabs, HorizontalScrollGrid, InfoCard, IntroCard
- 27af6d996b: Locking `rc-progress` to the working version of 3.1.4
- 10e5f9d10c: Do not `setState` when unmounted in `OverflowTooltip`
- b646a73fe0: In @backstage/plugin-scaffolder - When user will have one option available in hostUrl or owner - autoselect and select component should be readonly.

  in @backstage/core-components - Select component has extended API with few more props: native : boolean, disabled: boolean. native - if set to true - Select component will use native browser select picker (not rendered by Material UI lib ).
  disabled - if set to true - action on component will not be possible.

- 7a4bd2ceac: Prefer using `Link` from `@backstage/core-components` rather than material-UI.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0

## 0.8.1

### Patch Changes

- 2c17e5b073: Items in `<SidebarSubmenu>` are now only active when their full path is active (including search parameters).
- 9d6503e86c: Switched out usage of deprecated `OAuthRequestApi` types from `@backstage/core-plugin-api`.
- 1680a1c5ac: Add Missing Override Components Type for SidebarSpace, SidebarSpacer, and SidebarDivider Components.
- Updated dependencies
  - @backstage/core-plugin-api@0.3.1

## 0.8.0

### Minor Changes

- a036b65c2f: The `SignInPage` has been updated to use the new `onSignInSuccess` callback that was introduced in the same release. While existing code will usually continue to work, it is technically a breaking change because of the dependency on `SignInProps` from the `@backstage/core-plugin-api`. For more information on this change and instructions on how to migrate existing code, see the [`@backstage/core-app-api` CHANGELOG.md](https://github.com/backstage/backstage/blob/master/packages/core-app-api/CHANGELOG.md).

  Added a new `UserIdentity` class which helps create implementations of the `IdentityApi`. It provides a couple of static factory methods such as the most relevant `create`, and `createGuest` to create an `IdentityApi` for a guest user.

  Also provides a deprecated `fromLegacy` method to create an `IdentityApi` from the now deprecated `SignInResult`. This method will be removed in the future when `SignInResult` is also removed.

### Patch Changes

- 9603827bb5: Addressed some peer dependency warnings
- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- e839500286: Introduce new `LogViewer` component that can be used to display logs. It supports copying, searching, filtering, and displaying text with ANSI color escape codes.
- 1357ac30f1: Standardize on `classnames` instead of both that and `clsx`.
- e5976071ea: Use ellipsis style for overflowed text in sidebar menu
- Updated dependencies
  - @backstage/core-plugin-api@0.3.0

## 0.7.6

### Patch Changes

- e34f174fc5: Added `<SidebarSubmenu>` and `<SidebarSubmenuItem>` to enable building better sidebars. You can check out the storybook for more inspiration and how to get started.

  Added two new theme props for styling the sidebar too, `navItem.hoverBackground` and `submenu.background`.

- Updated dependencies
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2

## 0.7.5

### Patch Changes

- 157530187a: Pin sidebar by default for easier navigation
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/core-plugin-api@0.2.1

## 0.7.4

### Patch Changes

- 274a4fc633: Add Props Icon for Sidebar Item SidebarSearchField and Settings
- 682945e233: Changing the `Header` styles to use more theme variables. With this the title `font-size` will not change on resizing the window.
- 892c1d9202: Update OAuthAdapter to create identity.token from identity.idToken if it does not exist, and prevent overwrites to identity.toke. Update login page commonProvider to prefer .token over .idToken
- Updated dependencies
  - @backstage/core-plugin-api@0.2.0

## 0.7.3

### Patch Changes

- c11a37710a: Added a warning variant to `DismissableBanner` component. If you are using a
  custom theme, you will need to add the optional `palette.banner.warning` color,
  otherwise this variant will fall back to the `palette.banner.error` color.
- 5826c17b7d: Allow for `cellStyle` property on `TableColumn` to be a function as well as `React.CSSProperties` as per the Material UI Table component
- e0861b92ff: Add new way to override color selection to progress bar/gauge components.

  `Gauge`, `LinearGauge` and `GaugeCard` all accept a `getColor` prop,
  which is a function of the type:

  ```ts
  export type GaugePropsGetColor = (args: {
    palette: Palette;
    value: number;
    inverse?: boolean;
    max?: number;
  }) => string;
  ```

  Return a standard CSS color string (e.g. "red", "#f02020"), and the gauge will
  be set to that color.

  If the prop is omitted, the default implementation is unchanged from previous
  versions.

- 021986e8a3: fixed route resolving (issue #7741) when user cannot select a tab in any of the tabbed pages (like the Catalog page) if it shares the same initial letters as a preceding tab. (i.e. where tab with a path of /ci is followed by a path of /ci-2, user cannot select /ci-2 as /ci will always be selected first).
- a39a2105ef: Add Theme Overrides for Sidebar
- Updated dependencies
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13

## 0.7.2

### Patch Changes

- afd5c82ce1: Updates the d3 dependencies
- c6c2942daa: Deprecated `DismissbleBannerClassKey` and fixed the typo to make `DismissableBannerClassKey`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/errors@0.1.4
  - @backstage/core-plugin-api@0.1.12

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
