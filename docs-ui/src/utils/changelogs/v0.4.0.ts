import type { ChangelogProps } from '../types';

export const changelog_0_4_0: ChangelogProps[] = [
  {
    components: [],
    version: '0.4.0',
    prs: ['29667'],
    description: `**BREAKING**: Icons on Button and IconButton now need to be imported and placed like this: \`<Button iconStart={<ChevronDownIcon />} />\``,
    breaking: true,
    commitSha: 'ea36f74',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29989'],
    description: `**BREAKING**: We are modifying the way we treat custom render using 'useRender()' under the hood from BaseUI.`,
    breaking: true,
    commitSha: 'ccb1fc6',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29974'],
    description: `**BREAKING**: The icon prop in TextField now accept a ReactNode instead of an icon name. We also updated the icon sizes for each input sizes.`,
    breaking: true,
    commitSha: '04a65c6',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29878'],
    description: `Use correct colour token for TextField clear button icon, prevent layout shift whenever it is hidden or shown and properly size focus area around it. Also stop leading icon shrinking when used together with clear button.`,

    commitSha: 'c8f32db',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29642'],
    description: `Fix Canon missing dependencies`,

    commitSha: 'e996368',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29755'],
    description: `For improved a11y, clicking a Select component label now focuses the Select trigger element, and the TextField component's label is now styled to indicate it's interactive.`,

    commitSha: '720033c',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29820'],
    description: `Added new icon and onClear props to the TextField to make it easier to accessorize inputs.`,

    commitSha: '6189bfd',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29996'],
    description: `Add new Tabs component to Canon`,

    commitSha: '9510105',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29782'],
    description: `Pin version of @base-ui-components/react.`,

    commitSha: '97b25a1',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29688'],
    description: `Fixed an issue with Canon's DataTable.Pagination component showing the wrong number for the "to" count.`,

    commitSha: '206ffbe',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29665'],
    description: `Removed various typos`,

    commitSha: '72d019d',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29986'],
    description: `Update Menu component in Canon to make the UI more condensed. We are also adding a new Combobox option for nested navigation.`,

    commitSha: '4551fb7',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29826'],
    description: `Use the Field component from Base UI within the TextField.`,

    commitSha: '185d3a8',
  },
  {
    components: [],
    version: '0.4.0',
    prs: ['29988'],
    description: `Add new truncate prop to Text and Heading components in Canon.`,

    commitSha: '1ea1db0',
  },
];
