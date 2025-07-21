import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { appModule } from './modules/app';

export default createApp({
  features: [
    catalogPlugin,
    appModule,
  ],
});

