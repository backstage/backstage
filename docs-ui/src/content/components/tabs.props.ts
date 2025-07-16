import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const tabsRootPropDefs: Record<string, PropDef> = {
  defaultValue: {
    type: 'enum',
    values: ['any'],
    default: '0',
  },
  value: {
    type: 'enum',
    values: ['any'],
  },
  onValueChange: {
    type: 'enum',
    values: [`((value) => void)`],
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsListPropDefs: Record<string, PropDef> = {
  activateOnFocus: {
    type: 'boolean',
    default: 'false',
  },
  loop: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsTabPropDefs: Record<string, PropDef> = {
  value: {
    type: 'string',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsPanelPropDefs: Record<string, PropDef> = {
  value: {
    type: 'string',
  },
  keepMounted: {
    type: 'boolean',
    default: 'false',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsUsageSnippet = `import { Tabs } from '@backstage/ui';

<Tabs.Root>
    <Tabs.List>
      <Tabs.Tab>Tab 1</Tabs.Tab>
      <Tabs.Tab>Tab 2</Tabs.Tab>
      <Tabs.Tab>Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel>Content for Tab 1</Tabs.Panel>
    <Tabs.Panel>Content for Tab 2</Tabs.Panel>
    <Tabs.Panel>Content for Tab 3</Tabs.Panel>
</Tabs.Root>`;

export const tabsDefaultSnippet = `<Tabs.Root>
  <Tabs.List>
    <Tabs.Tab>Tab 1</Tabs.Tab>
    <Tabs.Tab>Tab 2</Tabs.Tab>
    <Tabs.Tab>Tab 3 With long title</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Content for Tab 1</Tabs.Panel>
  <Tabs.Panel>Content for Tab 2</Tabs.Panel>
  <Tabs.Panel>Content for Tab 3</Tabs.Panel>
</Tabs.Root>`;
