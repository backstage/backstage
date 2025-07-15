interface Page {
  title: string;
  slug: string;
  status?: 'alpha' | 'beta' | 'stable' | 'deprecated' | 'inProgress';
}

export const overview: Page[] = [
  {
    title: 'Getting Started',
    slug: '',
  },
  {
    title: 'About',
    slug: 'about',
  },
  {
    title: 'Changelog',
    slug: 'changelog',
  },
];

export const theme: Page[] = [
  {
    title: 'Iconography',
    slug: 'iconography',
  },
  {
    title: 'Layout',
    slug: 'layout',
  },
  {
    title: 'Responsive',
    slug: 'responsive',
  },
  {
    title: 'Theming',
    slug: 'theming',
  },
  {
    title: 'Typography',
    slug: 'typography',
  },
];

export const layoutComponents: Page[] = [
  {
    title: 'Box',
    slug: 'box',
    status: 'alpha',
  },
  {
    title: 'Container',
    slug: 'container',
    status: 'alpha',
  },
  {
    title: 'Grid',
    slug: 'grid',
    status: 'alpha',
  },
  {
    title: 'Flex',
    slug: 'flex',
    status: 'alpha',
  },
];

export const components: Page[] = [
  {
    title: 'Avatar',
    slug: 'avatar',
    status: 'alpha',
  },
  {
    title: 'Button',
    slug: 'button',
    status: 'alpha',
  },
  {
    title: 'ButtonIcon',
    slug: 'button-icon',
    status: 'alpha',
  },
  {
    title: 'ButtonLink',
    slug: 'button-link',
    status: 'alpha',
  },
  {
    title: 'Card',
    slug: 'card',
    status: 'alpha',
  },
  {
    title: 'Checkbox',
    slug: 'checkbox',
    status: 'alpha',
  },
  {
    title: 'Collapsible',
    slug: 'collapsible',
    status: 'alpha',
  },
  {
    title: 'Heading',
    slug: 'heading',
    status: 'alpha',
  },
  {
    title: 'Icon',
    slug: 'icon',
    status: 'alpha',
  },
  {
    title: 'Link',
    slug: 'link',
    status: 'alpha',
  },
  {
    title: 'Menu',
    slug: 'menu',
    status: 'alpha',
  },
  {
    title: 'RadioGroup',
    slug: 'radio-group',
    status: 'alpha',
  },
  {
    title: 'SearchField',
    slug: 'search-field',
    status: 'alpha',
  },
  {
    title: 'Select',
    slug: 'select',
    status: 'alpha',
  },
  {
    title: 'Skeleton',
    slug: 'skeleton',
    status: 'alpha',
  },
  {
    title: 'Switch',
    slug: 'switch',
    status: 'alpha',
  },
  {
    title: 'Table',
    slug: 'table',
    status: 'inProgress',
  },
  {
    title: 'Tabs',
    slug: 'tabs',
    status: 'alpha',
  },
  {
    title: 'Text',
    slug: 'text',
    status: 'alpha',
  },
  {
    title: 'TextField',
    slug: 'text-field',
    status: 'alpha',
  },
  {
    title: 'Tooltip',
    slug: 'tooltip',
    status: 'alpha',
  },
];

export type ScreenSize = {
  title: string;
  slug: string;
  width: number;
};

export const screenSizes: ScreenSize[] = [
  { title: 'Mobile', slug: 'mobile', width: 390 },
  { title: 'Tablet', slug: 'tablet', width: 768 },
  { title: 'Desktop', slug: 'desktop', width: 1280 },
  { title: 'Wide', slug: 'wide', width: 1600 },
];
