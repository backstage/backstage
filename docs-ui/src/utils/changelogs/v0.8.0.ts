import type { ChangelogProps } from '../types';

export const changelog_0_8_0: ChangelogProps[] = [
  {
    components: [],
    version: '0.8.0',
    prs: ['31238'],
    description: `**BREAKING**: Added a new \`PasswordField\` component. As part of this change, the \`password\` and \`search\` types have been removed from \`TextField\`.`,
    breaking: true,
    commitSha: '9acc1d6',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31399'],
    description: `**BREAKING** Restructure Backstage UI component styling to use CSS Modules instead of pure CSS. We don't expect this to be an issue in practice but it is important to call out that all styles are now loaded through CSS modules with generated class names. We are still providing fixed class names for all components to allow anyone to style their Backstage instance.`,
    breaking: true,
    commitSha: 'b0d11b5',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31409'],
    description: `**BREAKING** The ScrollArea component has been removed from Backstage UI because it did not meet our accessibility standards.`,
    breaking: true,
    commitSha: '0c53517',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31407'],
    description: `**BREAKING** Remove Icon component in Backstage UI. This component was creating issue for tree-shaking. It is recommended to use icons from @remixicon/react until we found a better alternative in Backstage UI.`,
    breaking: true,
    commitSha: '7b319c5',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31371'],
    description: `Adding a new Dialog component to Backstage UI.`,

    commitSha: '2591b42',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31216'],
    description: `remove default selection of tab`,

    commitSha: '827340f',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31389'],
    description: `Fix margin utility classes in Backstage UI.`,

    commitSha: '5dc17cc',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31394'],
    description: `Fix scroll jumping when opening menu in Backstage UI.`,

    commitSha: '85faee0',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31343'],
    description: `Making href mandatory in tabs that are part of a Header component`,

    commitSha: '3c921c5',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31367'],
    description: `Update react-aria-components to version 1.13.0`,

    commitSha: 'df7d2cf',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31393'],
    description: `Fix table sorting icon position in Backstage UI.`,

    commitSha: '507ee55',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31375'],
    description: `Add new \`virtualized\`, \`maxWidth\` and \`maxHeight\` props to \`Menu\`, \`MenuListBox\`, \`MenuAutocomplete\` and \`MenuAutocompleteListBox\` to allow for virtalization of long lists inside menus.`,

    commitSha: '8b7c3c9',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31374'],
    description: `Added support for data attributes in \`<Box />\`, \`<Container />\`, \`<Flex />\`, and \`<Grid />\` components, ensuring they are correctly applied to the rendered elements.`,

    commitSha: 'b940062',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31404'],
    description: `Cleaning up Backstage UI props definitions as well as removing ScrollArea in Card to improve accessibility.`,

    commitSha: '206c801',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31276'],
    description: `Add react router for internal routing for ButtonLinks`,

    commitSha: '5c21e45',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31365'],
    description: `Added a background color default on the body`,

    commitSha: '865bce8',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31362'],
    description: `We are restructuring our CSS to have a better layer structure.`,

    commitSha: 'af4d9b4',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31158'],
    description: `Improved SearchField component flex layout and animations. Fixed SearchField behavior in Header components by switching from width-based transitions to flex-basis transitions for better responsive behavior. Added new Storybook stories to test SearchField integration with Header component.`,

    commitSha: '9a47125',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31281'],
    description: `Remove auto selection of tabs for tabs that all have href defined`,

    commitSha: '9781815',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31232'],
    description: `Avoid overriding onChange when spreading props`,

    commitSha: '4adbb03',
  },
  {
    components: [],
    version: '0.8.0',
    prs: ['31339'],
    description: `Using react router for internal links in the Menu component`,

    commitSha: 'f6dff5b',
  },
];
