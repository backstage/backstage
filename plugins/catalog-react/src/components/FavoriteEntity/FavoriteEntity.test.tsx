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

import React from 'react';
import { storageApiRef } from '@backstage/core-plugin-api';

import { MockStarredEntitiesApi, starredEntitiesApiRef } from '../../apis';
import { FavoriteEntity } from './FavoriteEntity';
import { ComponentEntity } from '@backstage/catalog-model';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const entity: ComponentEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'example',
  },
  spec: {
    type: 'service',
    lifecycle: 'experimental',
    owner: 'user:default/john.doe_example.com',
  },
};

describe('<FavoriteEntity/>', () => {
  it('should add to favorites', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [storageApiRef, mockApis.storage()],
          [starredEntitiesApiRef, new MockStarredEntitiesApi()],
        ]}
      >
        <FavoriteEntity entity={entity} />
      </TestApiProvider>,
    );

    const addToFavorite = screen.getByRole('button', {
      name: 'Add to favorites',
    });

    // Should keep the label when hovering
    await userEvent.hover(addToFavorite);
    expect(addToFavorite).toBeInTheDocument();

    await userEvent.click(addToFavorite);
    expect(
      screen.getByRole('button', {
        name: 'Remove from favorites',
      }),
    ).toBeInTheDocument();
  });

  it('should remove from favorites', async () => {
    const starredEntities = new MockStarredEntitiesApi();
    await starredEntities.toggleStarred('component:default/example');

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [storageApiRef, mockApis.storage()],
          [starredEntitiesApiRef, starredEntities],
        ]}
      >
        <FavoriteEntity entity={entity} />
      </TestApiProvider>,
    );

    const removeFromFavorites = screen.getByRole('button', {
      name: 'Remove from favorites',
    });

    // Should keep the label when hovering
    await userEvent.hover(removeFromFavorites);
    expect(removeFromFavorites).toBeInTheDocument();

    await userEvent.click(removeFromFavorites);

    expect(
      screen.getByRole('button', {
        name: 'Add to favorites',
      }),
    ).toBeInTheDocument();
  });
});
