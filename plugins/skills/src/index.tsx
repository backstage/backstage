/*
 * Copyright 2025 The Backstage Authors
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

/**
 * Frontend plugin for browsing and managing agent skills.
 *
 * @packageDocumentation
 */

import {
  ApiBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef, skillDetailRouteRef } from './routes';
import { skillsApiRef } from './api';
import { SkillsClient } from '@backstage/plugin-skills-common';
import ControlCamera from '@material-ui/icons/ControlCamera';

export { skillsApiRef } from './api';
export { SkillsClient } from '@backstage/plugin-skills-common';

const skillsListPage = PageBlueprint.make({
  params: {
    path: '/skills',
    routeRef: rootRouteRef,
    title: 'Skills',
    icon: <ControlCamera />,
    loader: () =>
      import('./components/SkillsListPage').then(m => <m.SkillsListPage />),
  },
});

const skillDetailPage = PageBlueprint.make({
  name: 'detail',
  params: {
    path: '/skills/:name',
    routeRef: skillDetailRouteRef,
    loader: () =>
      import('./components/SkillDetailPage').then(m => <m.SkillDetailPage />),
  },
});

const api = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: skillsApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new SkillsClient({ discoveryApi, fetchApi }),
    }),
});

/** @public */
export default createFrontendPlugin({
  pluginId: 'skills',
  info: { packageJson: () => import('../package.json') },
  routes: {
    root: rootRouteRef,
    detail: skillDetailRouteRef,
  },
  extensions: [skillsListPage, skillDetailPage, api],
});
