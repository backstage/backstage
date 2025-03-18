import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'Canon',
  brandImage: 'logo.svg',
});

addons.setConfig({
  theme,
});
