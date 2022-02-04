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

import React from 'react';
import { useEntityTypeFilter } from '@backstage/plugin-catalog-react';
import { CategoryPicker } from './CategoryPicker';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { alertApiRef } from '@backstage/core-plugin-api';
import { fireEvent } from '@testing-library/react';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityTypeFilter: jest.fn(),
}));

describe('CategoryPicker', () => {
  const mockAlertApi = { post: jest.fn() };

  beforeEach(() => {
    mockAlertApi.post.mockClear();
  });

  it('should post the error to errorApi if an errors is returned', async () => {
    (useEntityTypeFilter as jest.Mock).mockReturnValue({
      error: new Error('something broked'),
    });

    await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <CategoryPicker />
      </TestApiProvider>,
    );

    expect(mockAlertApi.post).toHaveBeenCalledWith({
      message: expect.stringContaining('something broked'),
      severity: 'error',
    });
  });

  it('should render loading if the hook is loading', async () => {
    (useEntityTypeFilter as jest.Mock).mockReturnValue({
      loading: true,
    });

    const { findByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <CategoryPicker />
      </TestApiProvider>,
    );

    expect(await findByTestId('progress')).toBeInTheDocument();
  });

  it('should not render if there is no available types', async () => {
    (useEntityTypeFilter as jest.Mock).mockReturnValue({
      availableTypes: null,
    });

    const { queryByText } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <CategoryPicker />
      </TestApiProvider>,
    );

    expect(queryByText('Categories')).not.toBeInTheDocument();
  });

  it('renders the autocomplete with the availableTypes', async () => {
    const mockAvailableTypes = ['foo', 'bar'];

    (useEntityTypeFilter as jest.Mock).mockReturnValue({
      availableTypes: mockAvailableTypes,
    });

    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <CategoryPicker />
      </TestApiProvider>,
    );

    const openButton = getByRole('button', { name: 'Open' });
    openButton.click();

    expect(getByRole('checkbox', { name: 'Foo' })).toBeInTheDocument();
    expect(getByRole('checkbox', { name: 'Bar' })).toBeInTheDocument();
  });

  it('should call setSelectedTypes when one of the options are called', async () => {
    const mockAvailableTypes = ['foo', 'bar'];
    const mockSetSelectedTypes = jest.fn();

    (useEntityTypeFilter as jest.Mock).mockReturnValue({
      availableTypes: mockAvailableTypes,
      setSelectedTypes: mockSetSelectedTypes,
    });

    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <CategoryPicker />
      </TestApiProvider>,
    );

    const openButton = getByRole('button', { name: 'Open' });
    await fireEvent(openButton, new MouseEvent('click', { bubbles: true }));

    const fooCheckbox = getByRole('checkbox', { name: 'Foo' });
    await fireEvent(fooCheckbox, new MouseEvent('click', { bubbles: true }));

    expect(mockSetSelectedTypes).toHaveBeenCalledWith(['foo']);

    await fireEvent(openButton, new MouseEvent('click', { bubbles: true }));

    const barCheckbox = getByRole('checkbox', { name: 'Bar' });
    await fireEvent(barCheckbox, new MouseEvent('click', { bubbles: true }));

    expect(mockSetSelectedTypes).toHaveBeenCalledWith(['foo', 'bar']);
  });

  it('should render the selectedTypes already in the document', async () => {
    const mockAvailableTypes = ['foo', 'bar'];
    const mockSelectedTypes = ['foo'];

    (useEntityTypeFilter as jest.Mock).mockReturnValue({
      availableTypes: mockAvailableTypes,
      selectedTypes: mockSelectedTypes,
    });

    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, mockAlertApi]]}>
        <CategoryPicker />
      </TestApiProvider>,
    );

    const openButton = getByRole('button', { name: 'Open' });
    await fireEvent(openButton, new MouseEvent('click', { bubbles: true }));

    const fooCheckbox = getByRole('checkbox', { name: 'Foo' });
    expect(fooCheckbox).toBeChecked();
  });
});
