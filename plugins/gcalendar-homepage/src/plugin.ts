/*
 * Copyright 2022 The Backstage Authors
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
  createApiFactory,
  createComponentExtension,
  createPlugin,
  googleAuthApiRef,
} from '@backstage/core-plugin-api';

import { GCalendarApiClient, gcalendarApiRef } from './api';
import { rootRouteRef } from './routes';

export const gcalendarHomepagePlugin = createPlugin({
  id: 'gcalendar-homepage',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: gcalendarApiRef,
      deps: { authApi: googleAuthApiRef },
      factory(deps) {
        return new GCalendarApiClient(deps);
      },
    }),
  ],
});

export const CalendarCard = gcalendarHomepagePlugin.provide(
  createComponentExtension({
    name: 'CalendarCard',
    component: {
      lazy: () =>
        import('./components/CalendarCard').then(m => m.CalendarCardContainer),
    },
  }),
);
