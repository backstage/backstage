import type { ChangelogProps } from '../types';

export const changelog_0_19_0: ChangelogProps[] = [
  {
    components: ['checkbox', 'menu', 'switch'],
    version: '0.19.0',
    prs: ['36090'],
    description: `Updated React Aria dependencies to React Aria Components 1.22.0, React Aria 3.53.0, and React Stately 3.51.0. Existing Checkbox, Radio, and Switch implementations are retained.`,
    migration: `\`MenuSection\` no longer accepts \`disabledKeys\`. Move \`disabledKeys\` to \`Menu\` or set \`isDisabled\` on the affected \`MenuItem\` components.

Programmatic clicks on Checkbox and Switch labels no longer toggle their selection. Target the input when activating these controls programmatically, and use a full pointer interaction when simulating label clicks in tests.`,
    breaking: true,
    commitSha: '4e7a710',
  },
  {
    components: [],
    version: '0.19.0',
    prs: ['36165'],
    tokens: true,
    description: `The \`--bui-bg-app\` token now follows the page's \`color-scheme\` until a theme mode is set. While the app loads, the page background then matches a dark theme instead of showing as light. Browsers without \`light-dark()\` support keep the light value until the theme mode is set, as before.`,

    commitSha: '46659eb',
  },
  {
    components: ['combobox'],
    version: '0.19.0',
    prs: ['35970'],
    description: `Fixed \`Combobox\` keyboard selection while filtering. With \`search\`, or with \`items\` and no \`search\`, the arrow keys now move through the matching options only, and Enter selects the highlighted one. Screen readers also announce the number of matching options. As with a \`Combobox\` without \`search\`, opening the list with the button or on focus shows every option until the user types. With \`search.filter\`, Escape and blur now restore the label of the selected option even when the filter excludes it. In that case, the number of options announced to screen readers still counts the hidden selected option.`,

    commitSha: '6c9ed14',
  },
  {
    components: [],
    version: '0.19.0',
    prs: ['36138'],
    tokens: true,
    description: `Added a \`theme\` CSS cascade layer between \`components\` and \`utilities\`. BUI leaves it empty: put your app's brand overrides in \`@layer theme\` to win over component styles without raising specificity, while utility props still take precedence. Existing styles are unaffected.

  If your app already declares its own layer named \`theme\`, its rules now sit below BUI's utility classes instead of above them.`,

    commitSha: 'b313f2d',
  },
];
