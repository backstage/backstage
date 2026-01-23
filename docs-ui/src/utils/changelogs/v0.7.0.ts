import type { ChangelogProps } from '../types';

export const changelog_0_7_0: ChangelogProps[] = [
  {
    components: [],
    version: '0.7.0',
    prs: ['30654'],
    description: `**BREAKING**: We are moving our DataTable component to React Aria. We removed our DataTable to only use Table as a single and opinionated option for tables. This new structure is made possible by using React Aria under the hood.`,
    breaking: true,
    commitSha: '0615e54',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30874'],
    description: `**BREAKING**: Backstage UI - HeaderPage - We are updating the breadcrumb to be more visible and accessible.`,
    breaking: true,
    commitSha: 'b245c9d',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30908'],
    description: `**BREAKING**: We are updating the Menu component to use React Aria under the hood. The structure and all props are changing to follow React Aria's guidance.`,
    breaking: true,
    commitSha: '800f593',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30592'],
    description: `**BREAKING**: We are upgrading our \`Text\` component to support all font sizes making the \`Heading\` component redundant. The new \`Text\` component introduces 4 sizes for title and 4 sizes for body text. All of these work in multiple colors and font weights. We improved the \`as\` prop to include all possible values. The \`Link\` component has also been updated to match the new \`Text\` component.`,
    breaking: true,
    commitSha: 'b0e47f3',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30642'],
    description: `Fixes some styles on the Select component in BUI.`,

    commitSha: 'de89a3d',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30882'],
    description: `Export CardHeader, CardBody and CardFooter from Card component index`,

    commitSha: 'a251b3e',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30919'],
    description: `Add new TagGroup component to Backstage UI.`,

    commitSha: 'f761306',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30636'],
    description: `Fixes a couple of small bugs in BUI including setting H1 and H2 correctly on the Header and HeaderPage.`,

    commitSha: '75fead9',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30591'],
    description: `Update styling of Tooltip element`,

    commitSha: 'e7ff178',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30701'],
    description: `**BREAKING**: Move breadcrumb to fit in the \`HeaderPage\` instead of the \`Header\` in Backstage UI.`,
    breaking: true,
    commitSha: '230b410',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30626'],
    description: `We are motion away from \`motion\` to use \`gsap\` instead to make Backstage UI backward compatible with React 17.`,

    commitSha: '2f9a084',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30675'],
    description: `Updated Menu component in Backstage UI to use useId() from React Aria instead of React to support React 17.`,

    commitSha: 'd4e603e',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30800'],
    description: `Remove stylesheet import from Select component.`,

    commitSha: '8bdc491',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30729'],
    description: `Add \`startCollapsed\` prop on the \`SearchField\` component in BUI.`,

    commitSha: '404b426',
  },
  {
    components: [],
    version: '0.7.0',
    prs: ['30588'],
    description: `Adds onTabSelectionChange to ui header component.`,

    commitSha: 'e0e886f',
  },
];
