interface Page {
  title: string;
  slug: string;
  status?: 'alpha' | 'beta' | 'stable' | 'deprecated' | 'inProgress' | 'new';
}

export const layoutComponents: Page[] = [
  {
    title: 'Box',
    slug: 'box',
  },
  {
    title: 'Container',
    slug: 'container',
  },
  {
    title: 'Grid',
    slug: 'grid',
  },
  {
    title: 'Flex',
    slug: 'flex',
  },
];

export const components: Page[] = [
  {
    title: 'Avatar',
    slug: 'avatar',
  },
  {
    title: 'Button',
    slug: 'button',
  },
  {
    title: 'ButtonIcon',
    slug: 'button-icon',
  },
  {
    title: 'ButtonLink',
    slug: 'button-link',
  },
  {
    title: 'Card',
    slug: 'card',
  },
  {
    title: 'Checkbox',
    slug: 'checkbox',
  },
  {
    title: 'Collapsible',
    slug: 'collapsible',
  },
  {
    title: 'Dialog',
    slug: 'dialog',
  },
  {
    title: 'Header',
    slug: 'header',
  },
  {
    title: 'HeaderPage',
    slug: 'header-page',
  },
  {
    title: 'Link',
    slug: 'link',
  },
  {
    title: 'Menu',
    slug: 'menu',
  },
  {
    title: 'PasswordField',
    slug: 'password-field',
  },
  {
    title: 'RadioGroup',
    slug: 'radio-group',
  },
  {
    title: 'SearchField',
    slug: 'search-field',
  },
  {
    title: 'Select',
    slug: 'select',
  },
  {
    title: 'Skeleton',
    slug: 'skeleton',
  },
  {
    title: 'Switch',
    slug: 'switch',
  },
  {
    title: 'Table',
    slug: 'table',
  },
  {
    title: 'Tabs',
    slug: 'tabs',
  },
  {
    title: 'TagGroup',
    slug: 'tag-group',
  },
  {
    title: 'Text',
    slug: 'text',
  },
  {
    title: 'TextField',
    slug: 'text-field',
  },
  {
    title: 'Tooltip',
    slug: 'tooltip',
  },
  {
    title: 'VisuallyHidden',
    slug: 'visually-hidden',
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
