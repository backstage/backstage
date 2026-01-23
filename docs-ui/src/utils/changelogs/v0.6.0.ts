import type { ChangelogProps } from '../types';

export const changelog_0_6_0: ChangelogProps[] = [
  {
    components: [],
    version: '0.6.0',
    prs: ['30525'],
    description: `**BREAKING**: Canon has been renamed to Backstage UI. This means that \`@backstage/canon\` has been deprecated and replaced by \`@backstage/ui\`.`,
    breaking: true,
    commitSha: 'e92bb9b',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30461'],
    description: `**BREAKING**: We are moving our Tooltip component to use React Aria under the hood. In doing so, the structure of the component and its prop are changing to follow the new underlying structure.`,
    breaking: true,
    commitSha: '2e30459',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30467'],
    description: `Add new Card component to Canon.`,

    commitSha: '76255b8',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30410'],
    description: `Add new Header component to Canon.`,

    commitSha: 'b0a6c8e',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30448'],
    description: `Improve Button, ButtonIcon and ButtonLink styling in Canon.`,

    commitSha: 'be76576',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30440'],
    description: `Update return types for Heading & Text components for React 19.`,

    commitSha: '17beb9b',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30453'],
    description: `Add new tertiary variant to Button, ButtonIcon and ButtonLink in Canon.`,

    commitSha: 'eac4a4c',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30466'],
    description: `Add new Skeleton component in Canon`,

    commitSha: '8f2e82d',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30297'],
    description: `**BREAKING**:

  We’re updating our Button component to provide better support for button links.

  - We’re introducing a new \`ButtonLink\` component, which replaces the previous render prop pattern.
  - To maintain naming consistency across components, \`IconButton\` is being renamed to \`ButtonIcon\`.
  - Additionally, the render prop will be removed from all button-related components.

  These changes aim to simplify usage and improve clarity in our component API.`,
    breaking: true,
    commitSha: '4c6d891',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30325'],
    description: `We are consolidating all css files into a single styles.css in Canon.`,

    commitSha: '140f652',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30357'],
    description: `Add new SearchField component in Canon`,

    commitSha: '8154fb9',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30327'],
    description: `Add new \`RadioGroup\` + \`Radio\` component to Canon`,

    commitSha: '6910892',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30335'],
    description: `We are transforming how we structure our class names and data attributes definitions for all components. They are now all set in the same place.`,

    commitSha: 'a8a8514',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30342'],
    description: `Added placeholder prop to TextField component.`,

    commitSha: '667b951',
  },
  {
    components: [],
    version: '0.6.0',
    prs: ['30334'],
    description: `adding export for ButtonLink so it's importable`,

    commitSha: 'e71333a',
  },
];
