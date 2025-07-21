import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';

export default createApp({
  features: [
    catalogPlugin,
  ],
});

