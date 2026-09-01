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

import { UserEntity } from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { UserAvatar } from './UserAvatar';

describe('UserAvatar', () => {
  const user: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: { name: 'tara' },
    spec: {
      profile: {
        displayName: 'Tara',
        picture: 'https://example.com/staff/tara.jpeg',
      },
    },
  };

  it('renders the default avatar using catalog profile picture', async () => {
    await renderInTestApp(
      <UserAvatar entity={user} displayName="Tara" size="x-large" />,
    );

    const avatar = await screen.findByRole('img', { hidden: true });
    expect(avatar).toHaveAttribute(
      'src',
      'https://example.com/staff/tara.jpeg',
    );
  });
});
