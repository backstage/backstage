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
    title: 'Accordion',
    slug: 'accordion',
  },
  {
    title: 'Alert',
    slug: 'alert',
  },
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
    title: 'Popover',
    slug: 'popover',
    status: 'new',
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
    title: 'ToggleButton',
    slug: 'toggle-button',
  },
  {
    title: 'ToggleButtonGroup',
    slug: 'toggle-button-group',
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
