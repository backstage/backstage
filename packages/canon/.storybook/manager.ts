import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'My custom Storybook',
  brandUrl: 'https://example.com',
  brandImage: 'logo.svg',
  brandTarget: '_self',
});

addons.setConfig({
  theme,
});
