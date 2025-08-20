import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { homePlugin } from './plugins/home';
import { navModule } from './modules/nav';

export default createApp({
  features: [homePlugin,catalogPlugin, navModule],
});
