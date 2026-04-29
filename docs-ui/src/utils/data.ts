interface Page {
  title: string;
  slug: string;
  status?: 'alpha' | 'beta' | 'stable' | 'deprecated' | 'inProgress' | 'new';
}

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
    title: 'Badge',
    slug: 'badge',
  },
  {
    title: 'Box',
    slug: 'box',
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
    title: 'CheckboxGroup',
    slug: 'checkbox-group',
  },
  {
    title: 'Container',
    slug: 'container',
  },
  {
    title: 'DateRangePicker',
    slug: 'date-range-picker',
  },
  {
    title: 'Dialog',
    slug: 'dialog',
  },
  {
    title: 'Flex',
    slug: 'flex',
  },
  {
    title: 'Grid',
    slug: 'grid',
  },
  {
    title: 'PluginHeader',
    slug: 'plugin-header',
  },
  {
    title: 'Header',
    slug: 'header',
  },
  {
    title: 'Link',
    slug: 'link',
  },
  {
    title: 'List',
    slug: 'list',
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
  },
  {
    title: 'RadioGroup',
    slug: 'radio-group',
  },
  {
    title: 'SearchAutocomplete',
    slug: 'search-autocomplete',
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
    title: 'Slider',
    slug: 'slider',
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

export const hooks: Page[] = [
  {
    title: 'useBreakpoint',
    slug: 'use-breakpoint',
  },
];
