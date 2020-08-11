/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createPlugin, createRouteRef } from '@backstage/core';
import { TechDocsHome } from './reader/components/TechDocsHome';
import { TechDocsPage } from './reader/components/TechDocsPage';

export const rootRouteRef = createRouteRef({
  path: '/docs',
  title: 'TechDocs Landing Page',
});

export const rootDocsRouteRef = createRouteRef({
  path: '/docs/:entityId/*',
  title: 'Docs',
});

export const plugin = createPlugin({
  id: 'techdocs',
  register({ router }) {
    router.addRoute(rootRouteRef, TechDocsHome);
    router.addRoute(rootDocsRouteRef, TechDocsPage);
  },
});
