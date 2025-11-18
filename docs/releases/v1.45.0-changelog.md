# Release v1.45.0

Upgrade Helper: [https://backstage.github.io/upgrade-helper/?to=1.45.0](https://backstage.github.io/upgrade-helper/?to=1.45.0)

## @backstage/backend-app-api@1.3.0

### Minor Changes

- a17d9df: Updates API for `instanceMetadata` service to return a list of plugins not features.

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6

## @backstage/backend-plugin-api@1.5.0

### Minor Changes

- a17d9df: Promote `instanceMetadata` service to main entrypoint.
- 62fc2de: Explicitly mark `coreServices.rootInstanceMetadata` as a root service.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6
  - @backstage/plugin-permission-node@0.10.6

## @backstage/backend-test-utils@1.10.0

### Minor Changes

- d57b13b: Added support for Postgres 18 to the available `TestDatabases`.

  Note that the set of _default_ databases to test against for users of the `TestDatabases` class was also updated to include Postgres 14 and 18, instead of 13 and 17. If you need to override this, you can pass in an explicit `ids` argument, for example `ids: ['POSTGRES_17', 'POSTGRES_13', 'SQLITE_3']`.

### Patch Changes

- f3001fd: Tweak some of the mock services to have more precise types
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/backend-app-api@1.3.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6

## @backstage/core-plugin-api@1.12.0

### Minor Changes

- 83439b1: All route references are now forwards compatible with the new frontend system, i.e. `@backstage/frontend-plugin-api`. This means they no longer need to be converted with `convertLegacyRouteRef` or `convertLegacyRouteRefs` from `@backstage/core-compat-api`.

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6

## @backstage/eslint-plugin@0.2.0

### Minor Changes

- 926389b: Added `@backstage/no-ui-css-imports-in-non-frontend` rule, which ensures that CSS from `@backstage/ui` is not imported outside of the frontend app.

## @backstage/frontend-plugin-api@0.13.0

### Minor Changes

- 7d87b4f: Renamed `ExtensionDefinition` to `OverridableExtensionDefinition` and introduced a slimmer `ExtensionDefinition` type that does not include override methods. The overridable type is generally used as an output type, while plain `ExtensionDefinition`s are used for input. This reduces type conflicts across different of `@backstage/frontend-plugin-api`, improving long-term compatibility.

### Patch Changes

- 4d03f08: Internal refactor of route reference implementations with minor updates to the `toString` implementations.

- 7c6a66d: Added support for plugin-relative `attachTo` declarations for extension definitions. This allows for the creation of extension and extension blueprints that attach to other extensions of a particular `kind` in the same plugin, rather than needing to provide the exact extension ID. This is particularly useful when wanting to provide extension blueprints with a built-in hierarchy where the extensions created from one blueprint attach to extensions created from the other blueprint, for example:

  ```ts
  // kind: 'tabbed-page'
  const parentPage = TabbedPageBlueprint.make({
    params: {....}
  })
  // attachTo: { kind: 'tabbed-page', input: 'tabs' }
  const child1 = TabContentBlueprint.make({
    name: 'tab1',
    params: {....}
  })
  ```

- 878c251: Updated to `ExtensionInput` to make all type parameters optional.

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

- Updated dependencies
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0

## @backstage/repo-tools@0.16.0

### Minor Changes

- 11c61f2: The `package-docs` command will now automatically use a `typedoc.json` file if one exists at the root of your project.

### Patch Changes

- 8f56eae: Updated knip-reports to detect dependencies in dev/alpha pattern
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config-loader@1.10.6
  - @backstage/cli-node@0.2.15
  - @backstage/catalog-model@1.7.6

## @backstage/ui@0.9.0

### Minor Changes

- 539cf26: **BREAKING**: Migrated Avatar component from Base UI to custom implementation with size changes:

  - Base UI-specific props are no longer supported
  - Size values have been updated:
    - New `x-small` size added (1.25rem / 20px)
    - `small` size unchanged (1.5rem / 24px)
    - `medium` size unchanged (2rem / 32px, default)
    - `large` size **changed from 3rem to 2.5rem** (40px)
    - New `x-large` size added (3rem / 48px)

  Migration:

  ```diff
  # Remove Base UI-specific props
  - <Avatar src="..." name="..." render={...} />
  + <Avatar src="..." name="..." />

  # Update large size usage to x-large for same visual size
  - <Avatar src="..." name="..." size="large" />
  + <Avatar src="..." name="..." size="x-large" />
  ```

  Added `purpose` prop for accessibility control (`'informative'` or `'decoration'`).

- 5c614ff: **BREAKING**: Migrated Checkbox component from Base UI to React Aria Components.

  API changes required:

  - `checked` → `isSelected`
  - `defaultChecked` → `defaultSelected`
  - `disabled` → `isDisabled`
  - `required` → `isRequired`
  - `label` prop removed - use `children` instead
  - CSS: `bui-CheckboxLabel` class removed
  - Data attribute: `data-checked` → `data-selected`
  - Use without label is no longer supported

  Migration examples:

  Before:

  ```tsx
  <Checkbox label="Accept terms" checked={agreed} onChange={setAgreed} />
  ```

  After:

  ```tsx
  <Checkbox isSelected={agreed} onChange={setAgreed}>
    Accept terms
  </Checkbox>
  ```

  Before:

  ```tsx
  <Checkbox label="Option" disabled />
  ```

  After:

  ```tsx
  <Checkbox isDisabled>Option</Checkbox>
  ```

  Before:

  ```tsx
  <Checkbox />
  ```

  After:

  ```tsx
  <Checkbox>
    <VisuallyHidden>Accessible label</VisuallyHidden>
  </Checkbox>
  ```

- 134151f: Fixing styles on SearchField in Backstage UI after migration to CSS modules. `SearchField` has now its own set of class names. We previously used class names from `TextField` but this approach was creating some confusion so going forward in your theme you'll be able to theme `TextField` and `SearchField` separately.

- a67670d: **BREAKING**: Removed central `componentDefinitions` object and related type utilities (`ComponentDefinitionName`, `ComponentClassNames`).

  Component definitions are primarily intended for documenting the CSS class API for theming purposes, not for programmatic use in JavaScript/TypeScript.

  **Migration Guide:**

  If you were using component definitions or class names to build custom components, we recommend migrating to either:

  - Use Backstage UI components directly as building blocks, or
  - Duplicate the component CSS in your own stylesheets instead of relying on internal class names

- b78fc45: **BREAKING**: Changed className prop behavior to augment default styles instead of being ignored or overriding them.

  Affected components:

  - Menu, MenuListBox, MenuAutocomplete, MenuAutocompleteListbox, MenuItem, MenuListBoxItem, MenuSection, MenuSeparator
  - Switch
  - Skeleton
  - FieldLabel
  - Header, HeaderToolbar
  - HeaderPage
  - Tabs, TabList, Tab, TabPanel

  If you were passing custom className values to any of these components that relied on the previous behavior, you may need to adjust your styles to account for the default classes now being applied alongside your custom classes.

- 83c100e: **BREAKING**: Removed `Collapsible` component. Migrate to `Accordion` or use React Aria `Disclosure`.

  ## Migration Path 1: Accordion (Opinionated Styled Component)

  Accordion provides preset styling with a similar component structure.

  ```diff
  - import { Collapsible } from '@backstage/ui';
  + import { Accordion, AccordionTrigger, AccordionPanel } from '@backstage/ui';

  - <Collapsible.Root>
  -   <Collapsible.Trigger render={(props) => <Button {...props}>Toggle</Button>} />
  -   <Collapsible.Panel>Content</Collapsible.Panel>
  - </Collapsible.Root>

  + <Accordion>
  +   <AccordionTrigger title="Toggle" />
  +   <AccordionPanel>Content</AccordionPanel>
  + </Accordion>
  ```

  CSS classes: `.bui-CollapsibleRoot` → `.bui-Accordion`, `.bui-CollapsibleTrigger` → `.bui-AccordionTrigger` (now on heading element), `.bui-CollapsiblePanel` → `.bui-AccordionPanel`

  ## Migration Path 2: React Aria Disclosure (Full Customization)

  For custom styling without preset styles:

  ```tsx
  import { Disclosure, Button, DisclosurePanel } from 'react-aria-components';

  <Disclosure>
    <Button slot="trigger">Toggle</Button>
    <DisclosurePanel>Content</DisclosurePanel>
  </Disclosure>;
  ```

- 816af0f: **BREAKING**: The `SelectProps` interface now accepts a generic type parameter for selection mode.

  Added searchable and multiple selection support to Select component. The component now accepts `searchable`, `selectionMode`, and `searchPlaceholder` props to enable filtering and multi-selection modes.

  Migration: If you're using `SelectProps` type directly, update from `SelectProps` to `SelectProps<'single' | 'multiple'>`. Component usage remains backward compatible.

### Patch Changes

- d01de00: Fix broken external links in Backstage UI Header component.
- 35a3614: Fixed CSS issues in Select component including popover width constraints, focus outline behavior, and overflow handling.
- 01476f0: Improved visual consistency of PasswordField, SearchField, and MenuAutocomplete components.
- 26c6a78: Fix default text color in Backstage UI
- deaa427: Fixed Text component to prevent `truncate` prop from being spread to the underlying DOM element.
- 1059f95: Improved the Link component structure in Backstage UI.
- 836b0c7: Fixed dialog backdrop appearance in dark mode.
- 6874094: Migrated CellProfile component from Base UI Avatar to Backstage UI Avatar component.
- 719d772: Avatar components in x-small and small sizes now display only one initial instead of two, improving readability at smaller dimensions.
- 6d35a6b: Removed `@base-ui-components/react` dependency as all components now use React Aria Components.
- dac851f: Fix the default font size in Backstage UI.
- 3c0ea67: Fix CSS layer ordering in Backstage UI to make sure component styles are loaded after tokens and base declarations.
- 3b18d80: Fixed RadioGroup radio button ellipse distortion by preventing flex shrink and grow.
- 4eb455c: Fix font smoothing as default in Backstage UI.
- ff9f0c3: Enable tree-shaking of imports other than `*.css`.
- 7839e7b: Added `loading` prop to Button and ButtonIcon components for displaying spinner during async operations.
- a00fb88: Fixed Table Row component to properly support opening links in new tabs via right-click or Cmd+Click when using the `href` prop.
- e16ece5: Set the color-scheme property depending on theme
- 1ef3ca4: Added new VisuallyHidden component for hiding content visually while keeping it accessible to screen readers.
- 00bfb83: Fix default font wight and font family in Backstage UI.

## @backstage/plugin-catalog@1.32.0

### Minor Changes

- a521911: Add support for customizable icons in `SearchResultListItemBlueprint` and related components

### Patch Changes

- b500bcc: Fix React warnings for elements not having stable keys.
- a87c0a5: Fixed responsiveness issues with catalog entity content layout using the new frontend system.
- aff04d3: Fixed missing margins for entity warning content area on catalog entity page in NFS.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-search-react@1.10.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/catalog-client@1.12.1
  - @backstage/integration-react@1.2.12
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-scaffolder-common@1.7.3
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-catalog-backend@3.2.0

### Minor Changes

- 2d229b2: Enable YAML merge keys in yamlPlaceholderResolver
- 9d3ec06: Make YAML merge (&lt;&lt;:) support configurable in the Backstage Catalog instead of always being enabled
- 8c26af4: Enable YAML merge keys in yamlPlaceholderResolver

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/backend-openapi-utils@0.6.3
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-permission-node@0.10.6

## @backstage/plugin-catalog-backend-module-ldap@0.12.0

### Minor Changes

- 980f240: Moved from `ldapjs` dependency to `ldapts`

  ### Breaking Changes

  **Type Migration**

  Custom transformers must now accept `Entry` from `ldapts` instead of `SearchEntry`
  from `ldapjs` The Entry type provides direct property access without need for
  `.object()` or `.raw()` methods.

  If you have custom user or group transformers, update the signature from:

  ```typescript
  (vendor: LdapVendor, config: UserConfig, entry: SearchEntry) =>
    Promise<UserEntity | undefined>;
  ```

  to

  ```typescript
  (vendor: LdapVendor, config: UserConfig, entry: Entry) =>
    Promise<UserEntity | undefined>;
  ```

  **Search Options**

  Updated LDAP search configuration `typesOnly: false` → `attributeValues: true`
  This inverts the boolean logic: `ldapjs` used negative form while `ldapts` uses
  positive form. Both achieve the same result: retrieving attribute values rather
  than just attribute names.

  Update LDAP search options in configuration from

  ```yaml
  options:
    typesOnly: false
  ```

  to

  ```yaml
  options:
    attributeValues: true
  ```

  **API Changes** Removed `LdapClient.searchStreaming()` method. Users should
  migrate to `LdapClient.search()` instead

  If you're using `searchStreaming` directly:

  ```typescript
  // Before
  await client.searchStreaming(dn, options, async entry => {
    // process each entry
  });

  // After
  const entries = await client.search(dn, options);
  for (const entry of entries) {
    // process each entry
  }
  ```

  > **_NOTE:_**: Both methods have always loaded all entries into memory. The
  > `searchStreaming` method was only needed internally to handle `ldapjs`'s
  > event-based API.

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-node@1.20.0

### Minor Changes

- 9d3ec06: Make YAML merge (&lt;&lt;:) support configurable in the Backstage Catalog instead of always being enabled
- 8c26af4: Enable YAML merge keys in yamlPlaceholderResolver

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-permission-node@0.10.6

## @backstage/plugin-gateway-backend@1.1.0

### Minor Changes

- 229f63e: Added hop count tracking to prevent proxy loops. The gateway now tracks the number of proxy hops using the `backstage-gateway-hops` header and rejects requests that exceed 3 hops with a 508 Loop Detected error.
- a17d9df: Update usage of the `instanceMetadata` service.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0

## @backstage/plugin-notifications-backend@0.6.0

### Minor Changes

- 87e597c: Adds support for default configuration for an entire notification channel.
  This setting will also be inherited down to origins and topics while still respecting the users individual choices.

  This will be handy if you want to use a "opt-in" strategy.

### Patch Changes

- 15fb764: Show default settings for notifications even before receiving first notification.

  Previously, it was not possible for the users to see or modify their notification settings until they had received at
  least one notification from specific origin or topic.
  This update ensures that default settings are displayed from the outset,
  allowing users to customize their preferences immediately.

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-notifications-node@0.2.21
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-signals-node@0.1.26

## @backstage/plugin-notifications-common@0.2.0

### Minor Changes

- 87e597c: Adds support for default configuration for an entire notification channel.
  This setting will also be inherited down to origins and topics while still respecting the users individual choices.

  This will be handy if you want to use a "opt-in" strategy.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.6

## @backstage/plugin-scaffolder-backend-module-gitlab@0.10.0

### Minor Changes

- ff96d7e: fix scaffolder action createDeployToken to allow usage of oauth tokens

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-search@1.5.0

### Minor Changes

- a521911: Add support for customizable icons in `SearchResultListItemBlueprint` and related components

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-search-react@1.10.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-react@1.10.0

### Minor Changes

- a521911: Add support for customizable icons in `SearchResultListItemBlueprint` and related components

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-techdocs@1.16.0

### Minor Changes

- a521911: Add support for customizable icons in `SearchResultListItemBlueprint` and related components

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- a4d4a70: Fixed an issue where the entire TechDocs page would re-render when navigating between pages within the same entity's documentation.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-search-react@1.10.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/integration@1.18.2
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/catalog-client@1.12.1
  - @backstage/integration-react@1.2.12
  - @backstage/plugin-auth-react@0.1.21
  - @backstage/plugin-search-common@1.2.21

## @backstage/app-defaults@1.7.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/plugin-permission-react@0.4.38

## @backstage/backend-defaults@0.13.1

### Patch Changes

- 9bcfa77: Adjusted the log line wording of task worker starting

- 91ab2eb: Fix a bug in the Gitlab URL reader where `search` did not handle multiple globs

- fa255f5: Support for Bitbucket Cloud's API token was added as `appPassword` is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

  API token usage example:

  ```yaml
  integrations:
    bitbucketCloud:
      - username: user@domain.com
        token: my-token
  ```

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

- b2f6a5a: Fix #31348 issue where BitbucketUrlReader ignored provided token and instead always used integration credentials

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/backend-app-api@1.3.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config-loader@1.10.6
  - @backstage/config@1.3.6
  - @backstage/cli-node@0.2.15
  - @backstage/integration-aws-node@0.1.19
  - @backstage/plugin-permission-node@0.10.6

## @backstage/backend-dynamic-feature-service@0.7.6

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-backend@3.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/plugin-events-backend@0.5.8
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config-loader@1.10.6
  - @backstage/config@1.3.6
  - @backstage/cli-node@0.2.15
  - @backstage/plugin-scaffolder-node@0.12.1
  - @backstage/backend-openapi-utils@0.6.3
  - @backstage/plugin-app-node@0.1.39
  - @backstage/plugin-permission-node@0.10.6
  - @backstage/plugin-search-common@1.2.21

## @backstage/backend-openapi-utils@0.6.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0

## @backstage/catalog-client@1.12.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.6

## @backstage/catalog-model@1.7.6

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

## @backstage/cli@0.34.5

### Patch Changes

- fc7cbfc: The templates executed with the `yarn new` command now supports templating filenames.
- da19cb5: Fix inconsistent behavior in the `new` command for the `@internal` scope: it now consistently defaults to the `backstage-plugin-` infix whether the `--scope` option is not set or it's set to `internal`.
- fc7cbfc: Added a template for the `yarn new` command to create an catalog entity provider. To add this template to an explicit list in the root `package.json`, use `@backstage/cli/templates/catalog-provider-module`.
- b2bef92: Convert all enums to erasable-syntax compliant patterns
- 279279c: Fixes an issue where using the `backstage-cli new --scope` command with a scope that already includes the `@` symbol (e.g., `@backstage-community`) would result in a double `@@` prefix in the generated package name, causing invalid `package.json` files.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/eslint-plugin@0.2.0
  - @backstage/config-loader@1.10.6
  - @backstage/config@1.3.6
  - @backstage/cli-node@0.2.15
  - @backstage/catalog-model@1.7.6

## @backstage/cli-node@0.2.15

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

## @backstage/config@1.3.6

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

## @backstage/config-loader@1.10.6

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6

## @backstage/core-app-api@1.19.2

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/core-plugin-api@1.12.0
  - @backstage/config@1.3.6

## @backstage/core-compat-api@0.5.4

### Patch Changes

- 4d03f08: Internal refactor of route reference implementations with minor updates to the `toString` implementations.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-plugin-api@1.12.0

## @backstage/core-components@0.18.3

### Patch Changes

- 1c7e1ce: - Revert `viewbox` back to old values.
  - Added `fullScreen` prop to `EntityCatalogGraphCard`
- 96ad674: Line numbers in LogViewer will not be selectable in UI anymore
- b2bef92: Convert all enums to erasable-syntax compliant patterns
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/core-plugin-api@1.12.0
  - @backstage/config@1.3.6

## @backstage/create-app@0.7.6

### Patch Changes

- 2c1fe37: Bumped create-app version.
- 20fae88: Bumped create-app version.
- 9f939a6: Added `@backstage/plugin-app-visualizer` to the app in the `--next` template.
- fc7cbfc: Added the new `@backstage/cli/templates/catalog-provider-module` template to the explicit template configuration for the `next-app` template.

## @backstage/dev-utils@1.1.17

### Patch Changes

- b29a856: Fixed styling of the dev app by adding a lazy import of `@backstage/ui/css/styles.css`.
- Updated dependencies
  - @backstage/ui@0.9.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/catalog-model@1.7.6
  - @backstage/app-defaults@1.7.2
  - @backstage/integration-react@1.2.12

## @backstage/frontend-app-api@0.13.2

### Patch Changes

- 4d03f08: Internal refactor of route reference implementations with minor updates to the `toString` implementations.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/config@1.3.6
  - @backstage/frontend-defaults@0.3.3

## @backstage/frontend-defaults@0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/frontend-app-api@0.13.2
  - @backstage/core-components@0.18.3
  - @backstage/config@1.3.6
  - @backstage/plugin-app@0.3.2

## @backstage/frontend-dynamic-feature-loader@0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/config@1.3.6

## @backstage/frontend-test-utils@0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/frontend-app-api@0.13.2
  - @backstage/config@1.3.6
  - @backstage/plugin-app@0.3.2
  - @backstage/test-utils@1.7.13

## @backstage/integration@1.18.2

### Patch Changes

- fa255f5: Support for Bitbucket Cloud's API token was added as `appPassword` is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

  API token usage example:

  ```yaml
  integrations:
    bitbucketCloud:
      - username: user@domain.com
        token: my-token
  ```

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

- Updated dependencies
  - @backstage/config@1.3.6

## @backstage/integration-aws-node@0.1.19

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/config@1.3.6

## @backstage/integration-react@1.2.12

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/core-plugin-api@1.12.0
  - @backstage/config@1.3.6

## @techdocs/cli@1.10.2

### Patch Changes

- c2a2017: Fix for missing styles due to move to BUI.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-techdocs-node@1.13.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## @backstage/test-utils@1.7.13

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/core-app-api@1.19.2
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/config@1.3.6

## @backstage/plugin-api-docs@0.13.1

### Patch Changes

- 7c281a5: Add i18n support for Raw tab title and an error message
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog@1.32.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-app@0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/integration-react@1.2.12

## @backstage/plugin-app-backend@0.5.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config-loader@1.10.6
  - @backstage/config@1.3.6
  - @backstage/plugin-app-node@0.1.39

## @backstage/plugin-app-node@0.1.39

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config-loader@1.10.6

## @backstage/plugin-app-visualizer@0.1.25

### Patch Changes

- e81b3f0: Improve tree visualizer to use a horizontal layout and fill the content space.
- 722e2df: Migrated to use `@backstage/ui`.
- Updated dependencies
  - @backstage/ui@0.9.0
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0

## @backstage/plugin-auth@0.1.2

### Patch Changes

- 1609e79: Authentication content screen now uses application title.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3

## @backstage/plugin-auth-backend@0.25.6

### Patch Changes

- a9315d0: Change internal `state` column to `text` to support state of over 255 characters

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

- 51ff7d8: Allow configuring dynamic client registration token expiration with config `auth.experimentalDynamicClientRegistration.tokenExpiration`.

  Maximum expiration for the DCR token is 24 hours. Default expiration is 1 hour.

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-auth-backend-module-atlassian-provider@0.4.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-auth0-provider@0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-aws-alb-provider@0.4.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-backend@0.25.6
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-azure-easyauth-provider@0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-auth-backend-module-bitbucket-provider@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-bitbucket-server-provider@0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-cloudflare-access-provider@0.4.9

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.4.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-github-provider@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-gitlab-provider@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-google-provider@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-guest-provider@0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-auth-backend-module-microsoft-provider@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-oauth2-provider@0.4.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-oidc-provider@0.4.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-backend@0.25.6
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6

## @backstage/plugin-auth-backend-module-okta-provider@0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-onelogin-provider@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9

## @backstage/plugin-auth-backend-module-openshift-provider@0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-auth-backend-module-pinniped-provider@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6

## @backstage/plugin-auth-backend-module-vmware-cloud-provider@0.5.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-auth-node@0.6.9

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1

## @backstage/plugin-auth-react@0.1.21

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0

## @backstage/plugin-bitbucket-cloud-common@0.3.4

### Patch Changes

- fa255f5: Support for Bitbucket Cloud's API token was added as `appPassword` is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

  API token usage example:

  ```yaml
  integrations:
    bitbucketCloud:
      - username: user@domain.com
        token: my-token
  ```

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.

- Updated dependencies
  - @backstage/integration@1.18.2

## @backstage/plugin-catalog-backend-module-aws@0.4.17

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-azure@0.3.11

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.8

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/backend-openapi-utils@0.6.3

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-bitbucket-cloud-common@0.3.4
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.5.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-gcp@0.3.14

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-catalog-backend-module-gerrit@0.3.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-gitea@0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-github@0.11.2

### Patch Changes

- 999d1c1: Added configurable `pageSizes` for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with organizations with large number of repositories. Please see the [GitHub Discovery documentation](https://backstage.io/docs/integrations/github/discovery#configuration) for new configuration options.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-github-org@0.3.16

### Patch Changes

- 999d1c1: Added configurable `pageSizes` for GitHub GraphQL API queries to prevent `RESOURCE_LIMITS_EXCEEDED` errors with organizations with large number of teams and members. Please see the [GitHub Org Data documentation](https://backstage.io/docs/integrations/github/org#configuration-details) for new configuration options.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-catalog-backend-module-github@0.11.2
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6

## @backstage/plugin-catalog-backend-module-gitlab@0.7.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-gitlab-org@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-catalog-backend-module-gitlab@0.7.5

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.6

### Patch Changes

- 70745c5: Correctly handle entity removal computation when DB count query returns string
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-backend@3.2.0
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-catalog-backend-module-logs@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@3.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17

## @backstage/plugin-catalog-backend-module-msgraph@0.8.2

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-openapi@0.2.16

### Patch Changes

- a5bcb2a: fix wrong dereferencing for AsyncApi 3 documents
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-backend-module-puppetdb@0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-scaffolder-common@1.7.3

## @backstage/plugin-catalog-backend-module-unprocessed@0.6.6

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-unprocessed-entities-common@0.0.11

## @backstage/plugin-catalog-common@1.1.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-catalog-graph@0.5.3

### Patch Changes

- a2d7ae7: Ensure the catalog graph entity card respects the height prop so the visualization scales down properly on wide screens.
- 1c7e1ce: - Revert `viewbox` back to old values.
  - Added `fullScreen` prop to `EntityCatalogGraphCard`
- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1

## @backstage/plugin-catalog-import@0.13.7

### Patch Changes

- f987bfd: Fixed missing `catalog.entity.create` permission authorization in the default page extension.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/integration@1.18.2
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/integration-react@1.2.12
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-react@1.21.3

### Patch Changes

- 36d7582: Added missing i18n
- 2b7924b: Apply default ordering of templates
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- 904d136: Fixed catalog filter "all" not appearing as selected when set as the initially selected filter.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6
  - @backstage/frontend-test-utils@0.4.1
  - @backstage/catalog-client@1.12.1
  - @backstage/integration-react@1.2.12
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-catalog-unprocessed-entities@0.2.23

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-catalog-unprocessed-entities-common@0.0.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3

## @backstage/plugin-config-schema@0.1.74

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0

## @backstage/plugin-devtools@0.1.33

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-devtools-common@0.1.19
  - @backstage/plugin-permission-react@0.4.38

## @backstage/plugin-devtools-backend@0.5.11

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-devtools-common@0.1.19
  - @backstage/config-loader@1.10.6
  - @backstage/config@1.3.6
  - @backstage/plugin-permission-node@0.10.6

## @backstage/plugin-devtools-common@0.1.19

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3

## @backstage/plugin-events-backend@0.5.8

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/backend-openapi-utils@0.6.3

## @backstage/plugin-events-backend-module-aws-sqs@0.4.17

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6

## @backstage/plugin-events-backend-module-azure@0.2.26

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.2.26

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17

## @backstage/plugin-events-backend-module-bitbucket-server@0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17

## @backstage/plugin-events-backend-module-gerrit@0.2.26

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17

## @backstage/plugin-events-backend-module-github@0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6

## @backstage/plugin-events-backend-module-gitlab@0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6

## @backstage/plugin-events-backend-module-google-pubsub@0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6

## @backstage/plugin-events-backend-module-kafka@0.1.5

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6

## @backstage/plugin-events-backend-test-utils@0.1.50

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.17

## @backstage/plugin-events-node@0.4.17

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0

## @backstage/plugin-home@0.8.14

### Patch Changes

- 2ac5d29: Allow customization of `VisitList` by adding optional `enrichVisit`, `transformPathname`, `canSave` functions to `VisitsStorageApi`, along with `VisitDisplayProvider` for colors, labels
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-home-react@0.1.32
  - @backstage/catalog-client@1.12.1

## @backstage/plugin-home-react@0.1.32

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0

## @backstage/plugin-kubernetes@0.12.13

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/plugin-kubernetes-react@0.5.13
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-kubernetes-backend@0.20.4

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/plugin-kubernetes-node@0.3.6
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-permission-node@0.10.6

## @backstage/plugin-kubernetes-cluster@0.0.31

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/plugin-kubernetes-react@0.5.13
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-kubernetes-common@0.9.8

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-kubernetes-node@0.3.6

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-kubernetes-react@0.5.13

### Patch Changes

- 1906d37: Updated dependency `@kubernetes/client-node` to `1.4.0`.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/core-components@0.18.3
  - @backstage/plugin-kubernetes-common@0.9.8
  - @backstage/core-plugin-api@1.12.0
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-mcp-actions-backend@0.1.5

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/catalog-client@1.12.1

## @backstage/plugin-mui-to-bui@0.2.1

### Patch Changes

- 5c614ff: Updated BUI checkbox preview example to align with new component API.
- Updated dependencies
  - @backstage/ui@0.9.0
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/core-plugin-api@1.12.0

## @backstage/plugin-notifications@0.5.11

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-signals-react@0.0.17

## @backstage/plugin-notifications-backend-module-email@0.3.16

### Patch Changes

- 22a5362: Updated `AWS SES` client to version 2 to support `nodemailer` version 7.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-notifications-node@0.2.21
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/catalog-client@1.12.1

## @backstage/plugin-notifications-backend-module-slack@0.2.1

### Patch Changes

- d959bec: When an error message is logged due to inability to send a message with the Slack SDK, include the Slack Channel ID in the message to aid debugging.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-notifications-node@0.2.21
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-notifications-node@0.2.21

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-signals-node@0.1.26

## @backstage/plugin-org@0.6.46

### Patch Changes

- 6db9e7e: Improved responsiveness of GroupProfileCard component
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-catalog-common@1.1.7

## @backstage/plugin-org-react@0.1.44

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1

## @backstage/plugin-permission-backend@0.7.6

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6
  - @backstage/plugin-permission-node@0.10.6

## @backstage/plugin-permission-backend-module-allow-all-policy@0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/plugin-permission-node@0.10.6

## @backstage/plugin-permission-common@0.9.3

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/config@1.3.6

## @backstage/plugin-permission-node@0.10.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6

## @backstage/plugin-permission-react@0.4.38

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/config@1.3.6

## @backstage/plugin-proxy-backend@0.6.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-proxy-node@0.1.10

## @backstage/plugin-proxy-node@0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0

## @backstage/plugin-scaffolder@1.34.3

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/integration@1.18.2
  - @backstage/plugin-scaffolder-react@1.19.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/catalog-client@1.12.1
  - @backstage/integration-react@1.2.12
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-scaffolder-common@1.7.3

## @backstage/plugin-scaffolder-backend@3.0.1

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.15
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.16
  - @backstage/plugin-bitbucket-cloud-common@0.3.4
  - @backstage/integration@1.18.2
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.10.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-scaffolder-node@0.12.1
  - @backstage/backend-openapi-utils@0.6.3
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.14
  - @backstage/plugin-permission-node@0.10.6
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.15
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.15
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.15
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.15
  - @backstage/plugin-scaffolder-backend-module-github@0.9.2
  - @backstage/plugin-scaffolder-common@1.7.3

## @backstage/plugin-scaffolder-backend-module-azure@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.16

### Patch Changes

- fa255f5: Support for Bitbucket Cloud's API token was added as `appPassword` is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

  API token usage example:

  ```yaml
  integrations:
    bitbucketCloud:
      - username: user@domain.com
        token: my-token
  ```

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.15
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.15

## @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.15

### Patch Changes

- fa255f5: Support for Bitbucket Cloud's API token was added as `appPassword` is deprecated (no new creation from September 9, 2025) and will be removed on June 9, 2026.

  API token usage example:

  ```yaml
  integrations:
    bitbucketCloud:
      - username: user@domain.com
        token: my-token
  ```

- Updated dependencies
  - @backstage/plugin-bitbucket-cloud-common@0.3.4
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.3.15

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.3.17

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-gcp@0.2.15

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-gerrit@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-gitea@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-github@0.9.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-notifications@0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-notifications-node@0.2.21
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-rails@0.5.15

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-sentry@0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-backend-module-yeoman@0.4.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-scaffolder-node-test-utils@0.3.5
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-common@1.7.3

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-scaffolder-node@0.12.1

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-scaffolder-common@1.7.3

## @backstage/plugin-scaffolder-node-test-utils@0.3.5

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-test-utils@1.10.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-scaffolder-node@0.12.1

## @backstage/plugin-scaffolder-react@1.19.3

### Patch Changes

- 886a8a1: Fixed a bug in the Scaffolder's template parsing in the `useTemplateSchema` hook by removing the title instead of setting it to `undefined`
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-scaffolder-common@1.7.3

## @backstage/plugin-search-backend@2.0.8

### Patch Changes

- b2bef92: Convert all enums to erasable-syntax compliant patterns
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/config@1.3.6
  - @backstage/backend-openapi-utils@0.6.3
  - @backstage/plugin-permission-node@0.10.6
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-backend-module-catalog@0.3.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-backend-module-elasticsearch@1.7.8

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-backend-module-explore@0.3.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/config@1.3.6
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-backend-module-pg@0.5.50

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/config@1.3.6
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-backend-module-stack-overflow-collator@0.3.15

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/config@1.3.6
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-backend-module-techdocs@0.4.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/plugin-techdocs-node@1.13.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-backend-node@1.3.17

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/config@1.3.6
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-search-common@1.2.21

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3

## @backstage/plugin-signals@0.0.25

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- f0f006e: Fixes a bug where the `SignalClient` would try to subscribe to the same channel twice after an error, instead of just once.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-signals-react@0.0.17

## @backstage/plugin-signals-backend@0.3.10

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/config@1.3.6
  - @backstage/plugin-signals-node@0.1.26

## @backstage/plugin-signals-node@0.1.26

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-events-node@0.4.17
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/config@1.3.6

## @backstage/plugin-signals-react@0.0.17

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.12.0

## @backstage/plugin-techdocs-addons-test-utils@1.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs@1.16.0
  - @backstage/plugin-search-react@1.10.0
  - @backstage/plugin-catalog@1.32.0
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/integration-react@1.2.12
  - @backstage/test-utils@1.7.13

## @backstage/plugin-techdocs-backend@2.1.2

### Patch Changes

- 71c22f3: Removed/moved unused dependencies
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-techdocs-node@1.13.9
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/catalog-client@1.12.1

## @backstage/plugin-techdocs-module-addons-contrib@1.1.30

### Patch Changes

- 6929480: ExpandableCollapse Techdocs Addon was breaking native sidebar collapse on Firefox
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/integration@1.18.2
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/integration-react@1.2.12

## @backstage/plugin-techdocs-node@1.13.9

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/integration@1.18.2
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/plugin-search-common@1.2.21

## @backstage/plugin-techdocs-react@1.3.5

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6

## @backstage/plugin-user-settings@0.8.29

### Patch Changes

- 2b6fda3: Revert `storageApiRef` implementation
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-signals-react@0.0.17

## @backstage/plugin-user-settings-backend@0.3.8

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/plugin-signals-node@0.1.26

## example-app@0.2.115

### Patch Changes

- Updated dependencies
  - @backstage/plugin-api-docs@0.13.1
  - @backstage/ui@0.9.0
  - @backstage/plugin-org@0.6.46
  - @backstage/cli@0.34.5
  - @backstage/plugin-techdocs@1.16.0
  - @backstage/plugin-signals@0.0.25
  - @backstage/frontend-app-api@0.13.2
  - @backstage/plugin-search-react@1.10.0
  - @backstage/plugin-catalog@1.32.0
  - @backstage/plugin-search@1.5.0
  - @backstage/plugin-home@0.8.14
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.30
  - @backstage/plugin-scaffolder-react@1.19.3
  - @backstage/plugin-catalog-graph@0.5.3
  - @backstage/core-components@0.18.3
  - @backstage/plugin-user-settings@0.8.29
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/plugin-catalog-import@0.13.7
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/plugin-scaffolder@1.34.3
  - @backstage/plugin-catalog-unprocessed-entities@0.2.23
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-mui-to-bui@0.2.1
  - @backstage/plugin-devtools@0.1.33
  - @backstage/plugin-kubernetes@0.12.13
  - @backstage/plugin-notifications@0.5.11
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/app-defaults@1.7.2
  - @backstage/integration-react@1.2.12
  - @backstage/plugin-auth-react@0.1.21
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-kubernetes-cluster@0.0.31
  - @backstage/plugin-search-common@1.2.21

## example-app-next@0.0.29

### Patch Changes

- Updated dependencies
  - @backstage/plugin-api-docs@0.13.1
  - @backstage/ui@0.9.0
  - @backstage/plugin-org@0.6.46
  - @backstage/cli@0.34.5
  - @backstage/plugin-techdocs@1.16.0
  - @backstage/plugin-signals@0.0.25
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/frontend-app-api@0.13.2
  - @backstage/core-compat-api@0.5.4
  - @backstage/plugin-search-react@1.10.0
  - @backstage/plugin-catalog@1.32.0
  - @backstage/plugin-search@1.5.0
  - @backstage/plugin-home@0.8.14
  - @backstage/plugin-app-visualizer@0.1.25
  - @backstage/plugin-catalog-react@1.21.3
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.30
  - @backstage/plugin-scaffolder-react@1.19.3
  - @backstage/plugin-catalog-graph@0.5.3
  - @backstage/core-components@0.18.3
  - @backstage/plugin-user-settings@0.8.29
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/plugin-auth@0.1.2
  - @backstage/plugin-catalog-import@0.13.7
  - @backstage/plugin-permission-react@0.4.38
  - @backstage/plugin-scaffolder@1.34.3
  - @backstage/plugin-catalog-unprocessed-entities@0.2.23
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/frontend-defaults@0.3.3
  - @backstage/plugin-app@0.3.2
  - @backstage/plugin-kubernetes@0.12.13
  - @backstage/plugin-notifications@0.5.11
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/app-defaults@1.7.2
  - @backstage/integration-react@1.2.12
  - @backstage/plugin-auth-react@0.1.21
  - @backstage/plugin-catalog-common@1.1.7
  - @backstage/plugin-kubernetes-cluster@0.0.31
  - @backstage/plugin-search-common@1.2.21

## app-next-example-plugin@0.0.29

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3

## example-backend@0.0.44

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-backend@3.2.0
  - @backstage/plugin-search-backend-module-elasticsearch@1.7.8
  - @backstage/plugin-kubernetes-backend@0.20.4
  - @backstage/plugin-techdocs-backend@2.1.2
  - @backstage/plugin-signals-backend@0.3.10
  - @backstage/plugin-notifications-backend@0.6.0
  - @backstage/plugin-catalog-backend-module-openapi@0.2.16
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-permission-backend@0.7.6
  - @backstage/plugin-permission-common@0.9.3
  - @backstage/plugin-search-backend@2.0.8
  - @backstage/plugin-auth-backend@0.25.6
  - @backstage/plugin-scaffolder-backend@3.0.1
  - @backstage/plugin-search-backend-node@1.3.17
  - @backstage/plugin-events-backend@0.5.8
  - @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.8
  - @backstage/plugin-devtools-backend@0.5.11
  - @backstage/plugin-catalog-backend-module-unprocessed@0.6.6
  - @backstage/plugin-auth-node@0.6.9
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-mcp-actions-backend@0.1.5
  - @backstage/plugin-app-backend@0.5.8
  - @backstage/plugin-auth-backend-module-github-provider@0.3.9
  - @backstage/plugin-auth-backend-module-guest-provider@0.2.14
  - @backstage/plugin-auth-backend-module-openshift-provider@0.1.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.14
  - @backstage/plugin-events-backend-module-google-pubsub@0.1.6
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.2.14
  - @backstage/plugin-permission-node@0.10.6
  - @backstage/plugin-proxy-backend@0.6.8
  - @backstage/plugin-scaffolder-backend-module-github@0.9.2
  - @backstage/plugin-scaffolder-backend-module-notifications@0.1.16
  - @backstage/plugin-search-backend-module-catalog@0.3.10
  - @backstage/plugin-search-backend-module-explore@0.3.9
  - @backstage/plugin-search-backend-module-techdocs@0.4.8

## e2e-test@0.2.34

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.7.6

## @internal/frontend@0.0.15

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0

## @internal/scaffolder@0.0.15

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/plugin-scaffolder-react@1.19.3

## techdocs-cli-embedded-app@0.2.114

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.9.0
  - @backstage/cli@0.34.5
  - @backstage/plugin-techdocs@1.16.0
  - @backstage/plugin-catalog@1.32.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0
  - @backstage/core-app-api@1.19.2
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-techdocs-react@1.3.5
  - @backstage/app-defaults@1.7.2
  - @backstage/integration-react@1.2.12
  - @backstage/test-utils@1.7.13

## @internal/plugin-todo-list@1.0.45

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0

## @internal/plugin-todo-list-backend@1.0.45

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.0

## @internal/plugin-todo-list-common@1.0.28

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.3
