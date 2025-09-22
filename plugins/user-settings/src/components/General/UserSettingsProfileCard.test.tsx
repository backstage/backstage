/*
 * Copyright 2024 The Backstage Authors
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
  renderInTestApp,
  TestApiRegistry,
  mockApis,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { ApiProvider } from '@backstage/core-app-api';
import { UserSettingsProfileCard } from './UserSettingsProfileCard';

const apiRegistry = TestApiRegistry.from(
  [identityApiRef, mockApis.identity()],
  [
    catalogApiRef,
    catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1beta1',
          kind: 'User',
          metadata: {
            name: 'test',
            annotations: {},
          },
          spec: {
            profile: {
              picture: 'https://example.com/avatar.png',
            },
          },
        },
      ],
    }),
  ],
);

describe('<UserSettingsProfileCard />', () => {
  it('displays avatar if it exists in user entity', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <UserSettingsProfileCard />
      </ApiProvider>,
      {
        mountedRoutes: { '/catalog/:namespace/:kind/:name': entityRouteRef },
      },
    );
    expect(screen.getByAltText('Profile picture')).toHaveAttribute(
      'src',
      'https://example.com/avatar.png',
    );
  });
});
