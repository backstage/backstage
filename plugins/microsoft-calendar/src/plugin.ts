/*
 * Copyright 2023 The Backstage Authors
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
  createPlugin,
  microsoftAuthApiRef,
  fetchApiRef,
  createApiFactory,
  createComponentExtension,
} from '@backstage/core-plugin-api';
import {
  microsoftCalendarApiRef,
  MicrosoftCalendarApiClient,
} from './api/index';

export const microsoftCalendarPlugin = createPlugin({
  id: 'microsoft-calendar',
  apis: [
    createApiFactory({
      api: microsoftCalendarApiRef,
      deps: { authApi: microsoftAuthApiRef, fetchApi: fetchApiRef },
      factory(deps) {
        return new MicrosoftCalendarApiClient(deps);
      },
    }),
  ],
});

/** @public */
export const MicrosoftCalendarCard = microsoftCalendarPlugin.provide(
  createComponentExtension({
    name: 'MicrosoftCalendarCard',
    component: {
      lazy: () => import('./components').then(m => m.MicrosoftCalendar),
    },
  }),
);
