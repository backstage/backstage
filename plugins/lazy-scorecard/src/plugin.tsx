/*
 * Copyright 2026 The Backstage Authors
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
import {
  ApiBlueprint,
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { RiMedalLine } from '@remixicon/react';
import { scorecardApiRef, StaticScorecardApi } from './api';
import { entityRouteRef, rootRouteRef } from './routes';

const scorecardApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: scorecardApiRef,
      deps: {},
      factory: () => new StaticScorecardApi(),
    }),
});

const scorecardPage = PageBlueprint.make({
  params: {
    path: '/lazy-scorecard',
    routeRef: rootRouteRef,
    loader: () =>
      import('./components/ScorecardList').then(m => <m.ScorecardList />),
  },
});

const scorecardEntityContent = EntityContentBlueprint.make({
  params: {
    path: '/scorecard',
    title: 'Scorecard',
    routeRef: entityRouteRef,
    loader: () =>
      import('./components/EntityScorecardContent').then(m => (
        <m.EntityScorecardContent />
      )),
  },
});

/**
 * Demo plugin with an API, route refs and a catalog entity tab. The CLI can
 * defer it, so the plugin is loaded the first time its page is visited or its
 * entity tab is opened. The API is only used by the plugin itself, so it is
 * fine for it to be added to the app when the plugin is loaded.
 */
export default createFrontendPlugin({
  pluginId: 'lazy-scorecard',
  title: 'Lazy Scorecard',
  icon: <RiMedalLine />,
  extensions: [scorecardApi, scorecardPage, scorecardEntityContent],
  routes: {
    root: rootRouteRef,
    entity: entityRouteRef,
  },
});
