import { createDevApp } from '@backstage/frontend-dev-utils';

import plugin from '../src';

createDevApp({ features: [plugin] });
