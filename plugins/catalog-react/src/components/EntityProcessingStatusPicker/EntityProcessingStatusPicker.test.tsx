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

import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { EntityErrorFilter, EntityOrphanFilter } from '../../filters';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { EntityProcessingStatusPicker } from './EntityProcessingStatusPicker';
import { renderInTestApp } from '@backstage/test-utils';

describe('<EntityProcessingStatusPicker/>', () => {
  it('renders all processing status options', async () => {
    await renderInTestApp(
      <MockEntityListContextProvider value={{}}>
        <EntityProcessingStatusPicker />
      </MockEntityListContextProvider>,
    );
    expect(screen.getByText('Processing Status')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('processing-status-picker-expand'));
    expect(screen.getByText('Is Orphan')).toBeInTheDocument();
    expect(screen.getByText('Has Error')).toBeInTheDocument();
  });

  it('adds orphan to orphan filter', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
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

  it('adds error to error filter', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
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

  it('remove orphan from orphan filter', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
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

  it('remove error from error filter', async () => {
    const updateFilters = jest.fn();
    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
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
