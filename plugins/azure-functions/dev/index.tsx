import { createDevApp } from '@backstage/dev-utils';
import { azureFunctionsPlugin } from '../src/plugin';

createDevApp()
  .registerPlugin(azureFunctionsPlugin)
  .render();
