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
  renderWithEffects,
  wrapInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { UserSettingsIdentityCard } from './UserSettingsIdentityCard';
import { ApiProvider } from '@backstage/core-app-api';
import { identityApiRef } from '@backstage/core-plugin-api';

const apiRegistry = TestApiRegistry.from([
  identityApiRef,
  {
    getProfileInfo: jest.fn(async () => ({})),
    getBackstageIdentity: jest.fn(async () => ({
      type: 'user' as const,
      userEntityRef: 'foo:bar/foobar',
      ownershipEntityRefs: ['test-ownership'],
    })),
  },
]);

describe('<UserSettingsIdentityCard />', () => {
  it('displays an identity card', async () => {
    await renderWithEffects(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <UserSettingsIdentityCard />
        </ApiProvider>,
      ),
    );

    expect(screen.getByText('test-ownership')).toBeInTheDocument();
    expect(screen.getByText('foo:bar/foobar')).toBeInTheDocument();
  });
});
