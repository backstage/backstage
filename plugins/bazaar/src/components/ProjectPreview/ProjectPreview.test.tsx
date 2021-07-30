/*
 * Copyright 2021 The Backstage Authors
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
import { screen, cleanup } from '@testing-library/react';
import { ProjectPreview, compareEntitiesByDate } from './ProjectPreview';
import { renderInTestApp } from '@backstage/test-utils';
import { Entity } from '@backstage/catalog-model';

afterEach(() => {
  cleanup();
});

it('should render empty ProjectPreview', async () => {
  await renderInTestApp(<ProjectPreview entities={[]} />);
  const cardElement = screen.getByTestId('empty-bazaar');
  expect(cardElement).toBeInTheDocument();
  expect(cardElement).toHaveTextContent('Please add projects to the Bazaar');
});

const card1: Entity = {
  apiVersion: 'v1alpha',
  kind: 'Component',
  metadata: {
    name: 'title1',
    uid: '123',
    description: 'description',
    status: 'ongoing',
    tags: ['java', 'docker'],
    bazaar: {
      last_modified: '2021-07-29T09:06:59.282Z',
    },
  },
};

const card2: Entity = {
  apiVersion: 'v1alpha',
  kind: 'Component',
  metadata: {
    name: 'title2',
    uid: '124',
    description: 'description',
    status: 'proposed',
    tags: ['go', 'kubernetes'],
    bazaar: {
      last_modified: '2021-07-29T07:06:59.282Z',
    },
  },
};

const card3: Entity = {
  apiVersion: 'v1alpha',
  kind: 'Component',
  metadata: {
    name: 'title3',
    uid: '125',
    description: 'description',
    status: 'proposed',
    tags: [],
    bazaar: {
      last_modified: '2021-07-29T08:06:59.282Z',
    },
  },
};

const entities: Entity[] = [card1, card2, card3];

it('should render ProjectPreview entites', async () => {
  await renderInTestApp(<ProjectPreview entities={entities} />);
  const cards = screen.queryAllByTestId(id => id.startsWith('card'));
  expect(cards).toHaveLength(3);
});

it('should sort ProjectPreview entites', () => {
  const sortedEntites = [card1, card3, card2];
  entities.sort(compareEntitiesByDate);

  for (let i = 0; i < sortedEntites.length; i++) {
    expect(entities[i]).toEqual(sortedEntites[i]);
  }
});
