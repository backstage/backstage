/*
 * Copyright 2026 Estehsan Tariq
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
  createApiFactory,
  createFrontendPlugin,
  NavItemBlueprint,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
import SchoolIcon from '@material-ui/icons/School';
import { rootRouteRef } from './routes';
import { onboardingApiRef } from './api/OnboardingApi';
import { OnboardingClient } from './api/OnboardingClient';

/**
 * Page extension for the Onboarding plugin.
 * @public
 */
export const OnboardingPageExtension = PageBlueprint.make({
  params: {
    path: '/onboarding',
    routeRef: rootRouteRef,
    loader: () =>
      import('./components/OnboardingPage/OnboardingPage').then(m => (
        <m.OnboardingPage />
      )),
  },
});

/**
 * Sidebar navigation item for the Onboarding plugin.
 * @public
 */
export const OnboardingNavItem = NavItemBlueprint.make({
  params: {
    title: 'Onboarding',
    icon: SchoolIcon,
    routeRef: rootRouteRef,
  },
});

/**
 * API extension providing the OnboardingApi factory.
 * @public
 */
export const OnboardingApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams(
      createApiFactory({
        api: onboardingApiRef,
        deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
        factory: ({ discoveryApi, fetchApi }) =>
          new OnboardingClient({ discoveryApi, fetchApi }),
      }),
    ),
});

/**
 * Entity card extension showing onboarding progress for a user entity.
 * @public
 */
export const EntityUserOnboardingCardExtension = EntityCardBlueprint.make({
  name: 'user-onboarding',
  params: {
    filter: 'kind:user',
    loader: () =>
      import('./components/EntityUserOnboardingCard/EntityUserOnboardingCard').then(
        m => <m.EntityUserOnboardingCard />,
      ),
  },
});

/**
 * The Onboarding Backstage plugin.
 * @public
 */
export const onboardingPlugin = createFrontendPlugin({
  pluginId: 'onboarding',
  info: { packageJson: () => import('../package.json') },
  routes: {
    root: rootRouteRef,
  },
  extensions: [
    OnboardingPageExtension,
    OnboardingNavItem,
    OnboardingApi,
    EntityUserOnboardingCardExtension,
  ],
});
