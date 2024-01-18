/*
 * Copyright 2023 The Backstage Authors
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
import { PaginatedCatalogTable } from './PaginatedCatalogTable';
import { screen } from '@testing-library/react';
import { CatalogTableRow } from './types';

describe('PaginatedCatalogTable', () => {
  const data = new Array(100).fill(0).map((_, index) => {
    const name = `component-${index}`;
    return {
      entity: {
        apiVersion: '1',
        kind: 'component',
        metadata: {
          name,
        },
      },
      resolved: {
        name,
        entityRef: 'component:default/component',
      },
    } as CatalogTableRow;
  });

  const columns = [
    {
      title: 'Title',
      field: 'entity.metadata.name',
      searchable: true,
    },
  ];

  it('should display all the items', () => {
    render(<PaginatedCatalogTable data={data} columns={columns} />);

    for (const item of data) {
      expect(screen.queryByText(item.resolved.name)).toBeInTheDocument();
    }
  });

  it('should display and invoke the next button', async () => {
    const { rerender } = render(
      <PaginatedCatalogTable data={data} columns={columns} next={undefined} />,
    );

    expect(
      screen.queryAllByRole('button', { name: 'Next Page' })[0],
    ).toBeDisabled();

    const fn = jest.fn();

    rerender(<PaginatedCatalogTable data={data} columns={columns} next={fn} />);

    const nextButton = screen.queryAllByRole('button', {
      name: 'Next Page',
    })[0];
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(fn).toHaveBeenCalled();
  });

  it('should display and invoke the prev button', async () => {
    const { rerender } = render(
      <PaginatedCatalogTable data={data} columns={columns} prev={undefined} />,
    );

    expect(
      screen.queryAllByRole('button', { name: 'Next Page' })[0],
    ).toBeDisabled();

    const fn = jest.fn();

    rerender(<PaginatedCatalogTable data={data} columns={columns} prev={fn} />);

    const prevButton = screen.queryAllByRole('button', {
      name: 'Previous Page',
    })[0];
    expect(prevButton).toBeEnabled();

    fireEvent.click(prevButton);
    expect(fn).toHaveBeenCalled();
  });
});
