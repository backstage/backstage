import type { ChangelogProps } from '../types';

export const changelog_0_9_0: ChangelogProps[] = [
  {
    components: ['avatar'],
    version: '0.9.0',
    prs: ['31566'],
    description: `**BREAKING**: Migrated Avatar component from Base UI to custom implementation with size changes:

  - Base UI-specific props are no longer supported
  - Size values have been updated:
    - New \`x-small\` size added (1.25rem / 20px)
    - \`small\` size unchanged (1.5rem / 24px)
    - \`medium\` size unchanged (2rem / 32px, default)
    - \`large\` size **changed from 3rem to 2.5rem** (40px)
    - New \`x-large\` size added (3rem / 48px)`,
    migration: `\`\`\`diff
# Remove Base UI-specific props
- <Avatar src="..." name="..." render={...} />
+ <Avatar src="..." name="..." />

# Update large size usage to x-large for same visual size
- <Avatar src="..." name="..." size="large" />
+ <Avatar src="..." name="..." size="x-large" />
\`\`\`

Added \`purpose\` prop for accessibility control (\`'informative'\` or \`'decoration'\`).`,
    breaking: true,
    commitSha: '539cf26',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31517'],
    description: `**BREAKING**: Migrated Checkbox component from Base UI to React Aria Components.

  API changes required:

  - \`checked\` → \`isSelected\`
  - \`defaultChecked\` → \`defaultSelected\`
  - \`disabled\` → \`isDisabled\`
  - \`required\` → \`isRequired\`
  - \`label\` prop removed - use \`children\` instead
  - CSS: \`bui-CheckboxLabel\` class removed
  - Data attribute: \`data-checked\` → \`data-selected\`
  - Use without label is no longer supported`,
    migration: `Before:

\`\`\`tsx
<Checkbox label="Accept terms" checked={agreed} onChange={setAgreed} />
\`\`\`

After:

\`\`\`tsx
<Checkbox isSelected={agreed} onChange={setAgreed}>
  Accept terms
</Checkbox>
\`\`\`

Before:

\`\`\`tsx
<Checkbox label="Option" disabled />
\`\`\`

After:

\`\`\`tsx
<Checkbox isDisabled>Option</Checkbox>
\`\`\`

Before:

\`\`\`tsx
<Checkbox />
\`\`\`

After:

\`\`\`tsx
<Checkbox>
  <VisuallyHidden>Accessible label</VisuallyHidden>
</Checkbox>
\`\`\``,
    breaking: true,
    commitSha: '5c614ff',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31507'],
    description: `**BREAKING**: Fixing styles on SearchField in Backstage UI after migration to CSS modules. \`SearchField\` has now its own set of class names. We previously used class names from \`TextField\` but this approach was creating some confusion so going forward in your theme you'll be able to theme \`TextField\` and \`SearchField\` separately.`,
    breaking: true,
    commitSha: '134151f',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31744'],
    description: `**BREAKING**: Removed central \`componentDefinitions\` object and related type utilities (\`ComponentDefinitionName\`, \`ComponentClassNames\`).

  Component definitions are primarily intended for documenting the CSS class API for theming purposes, not for programmatic use in JavaScript/TypeScript.`,
    migration: `If you were using component definitions or class names to build custom components, we recommend migrating to either:

- Use Backstage UI components directly as building blocks, or
- Duplicate the component CSS in your own stylesheets instead of relying on internal class names`,
    breaking: true,
    commitSha: 'a67670d',
  },
  {
    components: [
      'menu',
      'switch',
      'skeleton',
      'plugin-header',
      'header-page',
      'tabs',
    ],
    version: '0.9.0',
    prs: ['31496'],
    description: `**BREAKING**: Changed className prop behavior to augment default styles instead of being ignored or overriding them.

  If you were passing custom className values to any of these components that relied on the previous behavior, you may need to adjust your styles to account for the default classes now being applied alongside your custom classes.`,
    breaking: true,
    commitSha: 'b78fc45',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31493'],
    description: `**BREAKING**: Removed \`Collapsible\` component. Migrate to \`Accordion\` or use React Aria \`Disclosure\`.`,
    migration: `**Path 1: Accordion (Opinionated Styled Component)**

Accordion provides preset styling with a similar component structure.

\`\`\`diff
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
\`\`\`

CSS classes: \`.bui-CollapsibleRoot\` → \`.bui-Accordion\`, \`.bui-CollapsibleTrigger\` → \`.bui-AccordionTrigger\` (now on heading element), \`.bui-CollapsiblePanel\` → \`.bui-AccordionPanel\`

**Path 2: React Aria Disclosure (Full Customization)**

For custom styling without preset styles:

\`\`\`tsx
import { Disclosure, Button, DisclosurePanel } from 'react-aria-components';

<Disclosure>
  <Button slot="trigger">Toggle</Button>
  <DisclosurePanel>Content</DisclosurePanel>
</Disclosure>;
\`\`\``,
    breaking: true,
    commitSha: '83c100e',
  },
  {
    components: ['select'],
    version: '0.9.0',
    prs: ['31649'],
    description: `**BREAKING**: The \`SelectProps\` interface now accepts a generic type parameter for selection mode.

  Added searchable and multiple selection support to Select component. The component now accepts \`searchable\`, \`selectionMode\`, and \`searchPlaceholder\` props to enable filtering and multi-selection modes.`,
    migration: `If you're using \`SelectProps\` type directly, update from \`SelectProps\` to \`SelectProps<'single' | 'multiple'>\`. Component usage remains backward compatible.`,
    breaking: true,
    commitSha: '816af0f',
  },
  {
    components: ['plugin-header'],
    version: '0.9.0',
    prs: ['31525'],
    description: `Fix broken external links in Backstage UI PluginHeader component.`,

    commitSha: 'd01de00',
  },
  {
    components: ['select'],
    version: '0.9.0',
    prs: ['31618'],
    description: `Fixed CSS issues in Select component including popover width constraints, focus outline behavior, and overflow handling.`,

    commitSha: '35a3614',
  },
  {
    components: ['password-field', 'searchfield'],
    version: '0.9.0',
    prs: ['31679'],
    description: `Improved visual consistency of PasswordField, SearchField, and MenuAutocomplete components.`,

    commitSha: '01476f0',
  },
  {
    components: ['text'],
    version: '0.9.0',
    prs: ['31429'],
    description: `Fix default text color in Backstage UI`,

    commitSha: '26c6a78',
  },
  {
    components: ['text'],
    version: '0.9.0',
    prs: ['31615'],
    description: `Fixed Text component to prevent \`truncate\` prop from being spread to the underlying DOM element.`,

    commitSha: 'deaa427',
  },
  {
    components: ['link'],
    version: '0.9.0',
    prs: ['31524'],
    description: `Improved the Link component structure in Backstage UI.`,

    commitSha: '1059f95',
  },
  {
    components: ['dialog'],
    version: '0.9.0',
    prs: ['31673'],
    description: `Fixed dialog backdrop appearance in dark mode.`,

    commitSha: '836b0c7',
  },
  {
    components: ['avatar'],
    version: '0.9.0',
    prs: ['31608'],
    description: `Migrated CellProfile component from Base UI Avatar to Backstage UI Avatar component.`,

    commitSha: '6874094',
  },
  {
    components: ['avatar'],
    version: '0.9.0',
    prs: ['31623'],
    description: `Avatar components in x-small and small sizes now display only one initial instead of two, improving readability at smaller dimensions.`,

    commitSha: '719d772',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31672'],
    description: `Removed \`@base-ui-components/react\` dependency as all components now use React Aria Components.`,

    commitSha: '6d35a6b',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31435'],
    description: `Fix the default font size in Backstage UI.`,

    commitSha: 'dac851f',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31448'],
    description: `Fix CSS layer ordering in Backstage UI to make sure component styles are loaded after tokens and base declarations.`,

    commitSha: '3c0ea67',
  },
  {
    components: ['radio-group'],
    version: '0.9.0',
    prs: ['31576'],
    description: `Fixed RadioGroup radio button ellipse distortion by preventing flex shrink and grow.`,

    commitSha: '3b18d80',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31444'],
    description: `Fix font smoothing as default in Backstage UI.`,

    commitSha: '4eb455c',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31516'],
    description: `Enable tree-shaking of imports other than \`*.css\`.`,

    commitSha: 'ff9f0c3',
  },
  {
    components: ['button', 'button-icon'],
    version: '0.9.0',
    prs: ['31681'],
    description: `Added \`loading\` prop to Button and ButtonIcon components for displaying spinner during async operations.`,

    commitSha: '7839e7b',
  },
  {
    components: ['table'],
    version: '0.9.0',
    prs: ['31680'],
    description: `Fixed Table Row component to properly support opening links in new tabs via right-click or Cmd+Click when using the \`href\` prop.`,

    commitSha: 'a00fb88',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31469'],
    description: `Set the color-scheme property depending on theme`,

    commitSha: 'e16ece5',
  },
  {
    components: ['visually-hidden'],
    version: '0.9.0',
    prs: ['31484'],
    description: `Added new VisuallyHidden component for hiding content visually while keeping it accessible to screen readers.`,

    commitSha: '1ef3ca4',
  },
  {
    components: [],
    version: '0.9.0',
    prs: ['31432'],
    description: `Fix default font weight and font family in Backstage UI.`,

    commitSha: '00bfb83',
  },
];
