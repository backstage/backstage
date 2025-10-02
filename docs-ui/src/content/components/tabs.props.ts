import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const tabsPropDefs: Record<string, PropDef> = {
  isDisabled: {
    type: 'boolean',
  },
  disabledKeys: {
    type: 'enum',
    values: ['string[]'],
  },
  selectedKey: {
    type: 'enum',
    values: ['string', 'null'],
  },
  defaultSelectedKey: {
    type: 'enum',
    values: ['string'],
  },
  onSelectionChange: {
    type: 'enum',
    values: [`(key: string) => void`],
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabPropDefs: Record<string, PropDef> = {
  id: {
    type: 'string',
  },
  isDisabled: {
    type: 'boolean',
  },
  href: {
    type: 'string',
  },
  hrefLang: {
    type: 'string',
  },
  target: {
    type: 'enum',
    values: ['HTMLAttributeAnchorTarget'],
  },
  rel: {
    type: 'string',
  },
  matchStrategy: {
    type: 'enum',
    values: ['exact', 'prefix'],
  },
  onHoverStart: {
    type: 'enum',
    values: [`(e: HoverEvent) => void`],
  },
  onHoverEnd: {
    type: 'enum',
    values: [`(e: HoverEvent) => void`],
  },
  onHoverChange: {
    type: 'enum',
    values: [`(isHovering: boolean) => void`],
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const tabsUsageSnippet = `import { Tabs } from '@backstage/ui';

<Tabs>
  <TabList>
    <Tab id="tab-1">Tab 1</Tab>
    <Tab id="tab-2">Tab 2</Tab>
    <Tab id="tab-3">Tab 3</Tab>
  </TabList>
  <TabPanel id="tab-1">Content for Tab 1</TabPanel>
  <TabPanel id="tab-2">Content for Tab 2</TabPanel>
  <TabPanel id="tab-3">Content for Tab 3</TabPanel>
</Tabs>`;

export const tabsDefaultSnippet = `import { Tabs } from '@backstage/ui';

<Tabs>
  <TabList>
    <Tab id="tab-1">Tab 1</Tab>
    <Tab id="tab-2">Tab 2</Tab>
    <Tab id="tab-3">Tab 3 With long title</Tab>
  </TabList>
</Tabs>`;

export const tabsWithTabPanelsSnippet = `<Tabs>
  <TabList>
    <Tab id="settings">Settings</Tab>
    <Tab id="profile">Profile</Tab>
    <Tab id="preferences">Preferences</Tab>
  </TabList>
  <TabPanel id="settings">Settings panel content goes here</TabPanel>
  <TabPanel id="profile">Profile panel content goes here</TabPanel>
  <TabPanel id="preferences">Preferences panel content goes here</TabPanel>
</Tabs>`;

export const tabsWithLinksSnippet = `<Tabs>
  <TabList>
    <Tab id="tab-1" href="/tab-1">Tab 1</Tab>
    <Tab id="tab-2" href="/tab-2">Tab 2</Tab>
    <Tab id="tab-3" href="/tab-3">Tab 3 With long title</Tab>
  </TabList>
</Tabs>`;

export const tabsWithDeeplyNestedRoutesSnippet = `<Tabs>
  <TabList>
    <Tab id="home" href="/home">Home</Tab>
    <Tab id="catalog" href="/catalog" matchStrategy="prefix">Catalog</Tab>
    <Tab id="mentorship" href="/mentorship" matchStrategy="prefix">Mentorship</Tab>
  </TabList>
</Tabs>`;
