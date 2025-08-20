
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { HomePage } from './HomePage';

export const homePlugin = createFrontendPlugin({
  pluginId: 'home',
  extensions: [HomePage],
});
