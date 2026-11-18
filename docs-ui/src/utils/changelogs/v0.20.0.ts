import type { ChangelogProps } from '../types';

export const changelog_0_20_0: ChangelogProps[] = [
  {
    components: [
      'button-link',
      'card',
      'combobox',
      'header',
      'link',
      'list',
      'menu',
      'plugin-header',
      'search-autocomplete',
      'select',
      'table',
      'tabs',
      'tag-group',
    ],
    version: '0.20.0',
    prs: ['34830'],
    description: `**BREAKING**: Backstage UI now uses explicit routing integration and React Aria's native link behavior: standalone apps that relied on automatic React Router integration must supply \`BUIProvider\` with a \`useNavigation\` hook, React Router is no longer a peer dependency, and \`routerOptions\` now supports only the router-neutral \`replace\` and \`state\` fields. **BREAKING**: Link targets using \`javascript:\`, \`data:\`, or \`vbscript:\` become inert \`about:blank\` links with a console warning. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [BUI routing migration guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#migrate-backstage-ui-routing) for integration requirements.`,
    breaking: true,
    commitSha: 'f4d8adf',
  },
  {
    components: [],
    version: '0.20.0',
    prs: ['36810'],
    description: `Removed an unused \`use-sync-external-store\` dependency, which is no longer needed now that React 18 is the minimum supported version.`,

    commitSha: '9d0a31b',
  },
  {
    components: [],
    version: '0.20.0',
    prs: ['36550'],
    description: `Updated dependency \`glob\` to \`^14.0.0\`.`,

    commitSha: '9120c46',
  },
  {
    components: ['header'],
    version: '0.20.0',
    prs: ['36177'],
    description: `\`Header\` tabs no longer make the page scroll horizontally when they do not fit. The tabs now stay in a single row that scrolls on its own, with a visible scrollbar. When more tabs are hidden on a side, that edge of the row fades out. The fade is removed while a tab has keyboard focus. The row scrolls to show the active tab when the page loads and whenever the active tab changes. With a mouse or other precise pointer, a scroll button also appears on each side that has hidden tabs. Small touch screens show only the fade. The buttons respect the reduced motion setting. Screen readers do not announce them, because every tab is still reachable with the keyboard.`,

    commitSha: '724657a',
  },
  {
    components: ['use-table'],
    version: '0.20.0',
    prs: ['35881'],
    description: `Fixed \`useTable\` in complete mode showing an empty page labelled "NaN - NaN of N" when \`paginationOptions\` switched from \`type: 'none'\` to paged pagination after mount.`,

    commitSha: '065d1e3',
  },
];
