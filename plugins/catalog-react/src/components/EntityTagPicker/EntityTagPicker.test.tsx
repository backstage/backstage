/*
 * Copyright 2021 Spotify AB
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
import { fireEvent, render } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { EntityTagPicker } from './EntityTagPicker';
import { EntityTagFilter } from '../../types';
import { MockEntityListContextProvider } from '../../testUtils/providers';

const taggedEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-1',
      tags: ['tag1', 'tag2'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'component-2',
      tags: ['tag3', 'tag4'],
    },
  },
];

describe('<EntityTagPicker/>', () => {
  it('renders all tags', () => {
    const rendered = render(
      <MockEntityListContextProvider
        value={{ entities: taggedEntities, backendEntities: taggedEntities }}
      >
        <EntityTagPicker />
      </MockEntityListContextProvider>,
    );
    expect(rendered.getByText('Tags')).toBeInTheDocument();
    taggedEntities
      .flatMap(e => e.metadata.tags!)
      .forEach(tag => {
        expect(rendered.getByText(tag)).toBeInTheDocument();
      });
  });

  it('adds tags to filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          entities: taggedEntities,
          backendEntities: taggedEntities,
          updateFilters,
        }}
      >
        <EntityTagPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).not.toHaveBeenCalled();

    fireEvent.click(rendered.getByText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: new EntityTagFilter(['tag1']),
    });
  });

  it('removes tags from filters', () => {
    const updateFilters = jest.fn();
    const rendered = render(
      <MockEntityListContextProvider
        value={{
          entities: taggedEntities,
          backendEntities: taggedEntities,
          updateFilters,
          filters: { tags: new EntityTagFilter(['tag1']) },
        }}
      >
        <EntityTagPicker />
      </MockEntityListContextProvider>,
    );
    expect(updateFilters).not.toHaveBeenCalled();
    expect(rendered.getByLabelText('tag1')).toBeChecked();

    fireEvent.click(rendered.getByText('tag1'));
    expect(updateFilters).toHaveBeenLastCalledWith({
      tags: undefined,
    });
  });
});
