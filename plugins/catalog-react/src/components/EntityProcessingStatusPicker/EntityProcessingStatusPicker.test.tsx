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

import { Entity } from '@backstage/catalog-model';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { EntityErrorFilter, EntityOrphanFilter } from '../../filters';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityProcessingStatusPicker } from './EntityProcessingStatusPicker';

const orphanAnnotation: Record<string, string> = {};
orphanAnnotation['backstage.io/orphan'] = 'true';

const sampleEntities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'valid-component',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'orphan-component',
      annotations: orphanAnnotation,
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'error-component',
      tags: ['Invalid Tag'],
    },
  },
];

describe('<EntityProcessingStatusPicker/>', () => {
  it('renders all processing status options', () => {
    render(
      <MockEntityListContextProvider
        value={{ entities: sampleEntities, backendEntities: sampleEntities }}
      >
        <EntityProcessingStatusPicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Processing Status')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('processing-status-picker-expand'));
    expect(screen.getByText('Is Orphan')).toBeInTheDocument();
    expect(screen.getByText('Has Error')).toBeInTheDocument();
  });

  it('adds orphan to orphan filter', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityProcessingStatusPicker />
      </MockEntityListContextProvider>,
    );

    fireEvent.click(screen.getByTestId('processing-status-picker-expand'));
    fireEvent.click(screen.getByText('Is Orphan'));
    expect(updateFilters).toHaveBeenCalledWith({
      orphan: new EntityOrphanFilter(true),
    });
  });

  it('adds error to error filter', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityProcessingStatusPicker />
      </MockEntityListContextProvider>,
    );

    fireEvent.click(screen.getByTestId('processing-status-picker-expand'));
    fireEvent.click(screen.getByText('Has Error'));
    expect(updateFilters).toHaveBeenCalledWith({
      error: new EntityErrorFilter(true),
    });
  });

  it('remove orphan from orphan filter', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityProcessingStatusPicker />
      </MockEntityListContextProvider>,
    );

    fireEvent.click(screen.getByTestId('processing-status-picker-expand'));
    fireEvent.click(screen.getByText('Is Orphan'));
    expect(updateFilters).toHaveBeenCalledWith({
      orphan: undefined,
    });
  });

  it('remove error from error filter', () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          entities: sampleEntities,
          backendEntities: sampleEntities,
          updateFilters,
        }}
      >
        <EntityProcessingStatusPicker />
      </MockEntityListContextProvider>,
    );

    fireEvent.click(screen.getByTestId('processing-status-picker-expand'));
    fireEvent.click(screen.getByText('Has Error'));
    expect(updateFilters).toHaveBeenCalledWith({
      error: undefined,
    });
  });
});
