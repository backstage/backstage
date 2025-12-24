import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const toggleButtonGroupPropDefs: Record<string, PropDef> = {
  selectionMode: {
    type: 'enum',
    values: ['single', 'multiple'],
    default: 'single',
  },
  orientation: {
    type: 'enum',
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
    responsive: true,
  },
  selectedKeys: { type: 'enum', values: ['Iterable<Key>'] },
  defaultSelectedKeys: { type: 'enum', values: ['Iterable<Key>'] },
  onSelectionChange: { type: 'enum', values: ['(keys) => void'] },
  isDisabled: { type: 'boolean', default: 'false' },
  disallowEmptySelection: { type: 'boolean', default: 'false' },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const toggleButtonGroupUsageSnippet = `import { ToggleButtonGroup, ToggleButton } from '@backstage/ui';

<ToggleButtonGroup selectionMode="single">
  <ToggleButton id="dogs">Dogs</ToggleButton>
  <ToggleButton id="cats">Cats</ToggleButton>
</ToggleButtonGroup>`;

export const toggleButtonGroupSingleSnippet = `<ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['apples']}>
  <ToggleButton id="apples">Apples</ToggleButton>
  <ToggleButton id="oranges">Oranges</ToggleButton>
  <ToggleButton id="bananas">Bananas</ToggleButton>
</ToggleButtonGroup>`;

export const toggleButtonGroupMultipleSnippet = `<ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['frontend']}>
  <ToggleButton id="frontend">Frontend</ToggleButton>
  <ToggleButton id="backend">Backend</ToggleButton>
  <ToggleButton id="platform">Platform</ToggleButton>
</ToggleButtonGroup>`;

export const toggleButtonGroupVerticalSnippet = `<ToggleButtonGroup selectionMode="single" orientation="vertical">
  <ToggleButton id="low">Low</ToggleButton>
  <ToggleButton id="medium">Medium</ToggleButton>
  <ToggleButton id="high">High</ToggleButton>
</ToggleButtonGroup>`;

export const toggleButtonGroupDisabledSnippet = `<ToggleButtonGroup selectionMode="single" isDisabled>
  <ToggleButton id="cat">Cat</ToggleButton>
  <ToggleButton id="dog">Dog</ToggleButton>
  <ToggleButton id="bird">Bird</ToggleButton>
</ToggleButtonGroup>`;

export const toggleButtonGroupDisallowEmptySnippet = `<ToggleButtonGroup selectionMode="single" disallowEmptySelection defaultSelectedKeys={['one']}>
  <ToggleButton id="one">One</ToggleButton>
  <ToggleButton id="two">Two</ToggleButton>
  <ToggleButton id="three">Three</ToggleButton>
</ToggleButtonGroup>`;

export const toggleButtonGroupIconsSnippet = `<ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['cloud']}>
  <ToggleButton id="cloud" iconStart="cloud">Cloud</ToggleButton>
  <ToggleButton id="starred" iconStart="starFill">Starred</ToggleButton>
  <ToggleButton id="next" iconEnd="arrowRight">Next</ToggleButton>
</ToggleButtonGroup>`;

export const toggleButtonGroupIconsOnlySnippet = `<ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
  <ToggleButton id="cloud" aria-label="Cloud" iconStart="cloud" />
  <ToggleButton id="star" aria-label="Star" iconStart="starLine" />
  <ToggleButton id="next" aria-label="Next" iconEnd="arrowRight" />
</ToggleButtonGroup>`;
