import { createDevApp } from '@backstage/dev-utils';
import { plugin } from '../src/plugin';

createDevApp().registerPlugin(plugin).render();
