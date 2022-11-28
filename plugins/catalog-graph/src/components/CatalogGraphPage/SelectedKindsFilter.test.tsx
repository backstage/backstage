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

import { GetEntityFacetsResponse } from '@backstage/catalog-client';
import { ApiProvider } from '@backstage/core-app-api';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderWithEffects, TestApiRegistry } from '@backstage/test-utils';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SelectedKindsFilter } from './SelectedKindsFilter';

const catalogApi = {
  getEntityFacets: jest.fn().mockResolvedValue({
    facets: {
      kind: [
        { value: 'Component', count: 2 },
        { value: 'System', count: 1 },
        { value: 'API', count: 1 },
        { value: 'Resource', count: 1 },
      ],
    },
  } as GetEntityFacetsResponse),
};
const apis = TestApiRegistry.from(
  [catalogApiRef, catalogApi],
  [alertApiRef, {} as AlertApi],
);

describe('<SelectedKindsFilter/>', () => {
  it('should not explode while loading', async () => {
    const { baseElement } = await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedKindsFilter value={['api', 'component']} onChange={() => {}} />
      </ApiProvider>,
    );
    expect(baseElement).toBeInTheDocument();
  });

  it('should render current value', async () => {
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedKindsFilter value={['api', 'component']} onChange={() => {}} />
      </ApiProvider>,
    );

    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('Component')).toBeInTheDocument();
  });

  it('should select value', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedKindsFilter value={['api', 'component']} onChange={onChange} />
      </ApiProvider>,
    );

    await userEvent.click(screen.getByLabelText('Open'));
    await waitFor(() => expect(screen.getByText('System')).toBeInTheDocument());

    await userEvent.click(screen.getByText('System'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['api', 'component', 'system']);
    });
  });

  it('should return undefined if all values are selected', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedKindsFilter
          value={['api', 'component', 'system', 'domain']}
          onChange={onChange}
        />
      </ApiProvider>,
    );
    await userEvent.click(screen.getByLabelText('Open'));

    await waitFor(() =>
      expect(screen.getByText('Resource')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Resource'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  it('should return all values when cleared', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedKindsFilter value={[]} onChange={onChange} />
      </ApiProvider>,
    );

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.tab();

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });
});
